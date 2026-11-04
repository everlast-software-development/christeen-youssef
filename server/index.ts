import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import compression from 'compression';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { contact } from './contact';
import { country } from './country';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist/client');

// Local SMTP settings from .env (Railway injects real environment variables,
// which take precedence — loadEnvFile never overwrites one already set).
if (existsSync(join(root, '.env'))) process.loadEnvFile(join(root, '.env'));
// `npm run dev` passes --dev; `npm start` serves the production build.
const dev = process.argv.includes('--dev');
const port = Number(process.env.PORT) || 3000;

const app = express();
app.disable('x-powered-by');
// Railway (and Cloudflare in front of it) forward the client address.
app.set('trust proxy', 1);
app.use(compression());

/**
 * Paths only a vulnerability scanner asks for — no PHP, admin panel or CMS
 * lives here. Answered in a few bytes (and cacheable at Cloudflare) instead of
 * the full 404 page. `.well-known` is deliberately absent.
 */
const PROBE =
  /(^|\/)(wp-|wordpress|xmlrpc|phpmyadmin|pma|myadmin|administrator|admin\/|cgi-bin|vendor\/|owa\/|autodiscover|\.env|\.git|\.svn|\.hg|\.aws|\.ssh|\.vscode|\.idea|\.DS_Store|config\.(json|php|yml)|backup|dump\.sql|wlwmanifest)|\.(php[0-9]?|asp|aspx|jsp|cgi|sql|bak|old|swp|tar|gz|zip|rar|7z)$/i;

app.use((request: Request, response: Response, next: NextFunction) => {
  if (!PROBE.test(request.path)) return next();
  response
    .status(404)
    .set({ 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600', 'x-robots-tag': 'noindex' })
    .send('Not Found');
});

// Legacy URLs, permanently moved.
const REDIRECTS: Record<string, string> = {
  '/gallery': '/before-and-after',
  '/appointment': '/reach-me',
  '/publications': '/before-and-after',
};
app.get(Object.keys(REDIRECTS), (request, response) => response.redirect(301, REDIRECTS[request.path]));
app.get('/blogs/:slug', (request, response) => response.redirect(301, `/blog/${request.params.slug}`));

// ---- API ----
// Behind Cloudflare the real visitor is in cf-connecting-ip; otherwise the
// proxy-resolved request IP. IPv6 addresses are grouped by /56.
const visitor = (request: Request) =>
  ipKeyGenerator(request.get('cf-connecting-ip') ?? request.ip ?? 'unknown');

const limitContact = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: visitor,
  message: { success: false, error: 'Too many messages. Please try again later, or call the clinic.' },
});
const limitCountry = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: visitor,
  message: { countryCode: null },
});

app.post('/api/contact', limitContact, express.json({ limit: '20kb' }), contact);
app.get('/api/country', limitCountry, country);
app.use('/api', (_request, response) => response.status(404).json({ error: 'Not found.' }));
// Malformed JSON bodies.
app.use('/api', (error: Error, _request: Request, response: Response, next: NextFunction) => {
  if ((error as { type?: string }).type === 'entity.parse.failed') {
    response.status(400).json({ success: false, error: 'Invalid JSON body.' });
    return;
  }
  next(error);
});

async function start() {
  if (dev) {
    // Development: Vite serves the app (client-rendered) with hot reload.
    const { createServer } = await import('vite');
    const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    // Production: the prerendered build. Hashed assets are immutable; HTML is
    // revalidated so a deploy shows up immediately.
    app.use(
      express.static(dist, {
        index: false,
        redirect: false,
        setHeaders: (response, file) => {
          response.set(
            'cache-control',
            /[\\/]assets[\\/]/.test(file) ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
          );
        },
      }),
    );

    // Clean URLs: /about-me → dist/client/about-me/index.html. A trailing
    // slash is redirected away so each page has one URL.
    app.get('/{*path}', (request, response, next) => {
      const path = decodeURIComponent(request.path);
      if (path.length > 1 && path.endsWith('/')) {
        response.redirect(301, path.slice(0, -1) + (request.url.slice(request.path.length) || ''));
        return;
      }
      const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html');
      if (file.startsWith(dist) && existsSync(file)) {
        response.set('cache-control', 'public, max-age=0, must-revalidate').sendFile(file);
        return;
      }
      next();
    });

    // Anything else is a real 404, with the site's own page.
    app.use((_request, response) => {
      response.status(404).sendFile(join(dist, '404.html'));
    });
  }

  app.listen(port, () => {
    console.log(`${dev ? 'dev' : 'production'} server on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
