import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource-variable/manrope/wght.css';
import '@/styles/globals.css';
import { App } from '@/App';

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

const root = document.getElementById('root')!;

// Prerendered pages arrive with the markup already in place, so React takes it
// over (hydrate); the dev server sends a root holding only the <!--app-html-->
// placeholder comment, so React renders it. An element, not any child node:
// the comment alone must not count as markup.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
