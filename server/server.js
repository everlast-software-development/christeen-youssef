'use strict';

require('dotenv').config();

const path       = require('path');
const express    = require('express');
const cors       = require('cors');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:4173',  // Vite preview
    'https://drchristeenyoussef.com',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'CF-IPCountry', 'cf-ipcountry'],
}));

// ─── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  requireTLS: true,
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
    minVersion: 'TLSv1.2'
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error('❌ SMTP connection error:', err.message);
    console.error('   Host:', process.env.EMAIL_HOST);
    console.error('   Port:', process.env.EMAIL_PORT);
    console.error('   User:', process.env.EMAIL_USER);
  } else {
    console.log('  ✓  SMTP connected and ready');
  }
});

// ─── Validate contact payload ─────────────────────────────────────────────────
function validateContact({ name, phone, email, subject, message }) {
  const errors = [];
  if (!name  || typeof name  !== 'string' || name.trim().length < 2)    errors.push('Invalid name.');
  if (!phone || typeof phone !== 'string' || phone.trim().length < 5)   errors.push('Invalid phone.');
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email.');
  if (!subject || typeof subject !== 'string' || subject.trim().length < 2) errors.push('Invalid subject.');
  if (!message || typeof message !== 'string' || message.trim().length < 10) errors.push('Message too short.');
  return errors;
}

// ─── POST /api/contact ────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  console.log('📧 Received contact form submission:', req.body);

  const { name, phone, email, subject, message } = req.body;

  if (!name || !phone || !email || !subject || !message) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const errors = validateContact({ name, phone, email, subject, message });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const recipient = process.env.EMAIL_TO || 'customer.service@everlastwellness.com';

  const mailOptions = {
    from:    `"Dr. Christeen Youssef" <${process.env.EMAIL_USER}>`,
    to:      recipient,
    replyTo: email,
    subject: `${subject || 'New Contact Form Submission'} — ${name}`,
    text: `
Name:    ${name}
Phone:   ${phone}
Email:   ${email}
Subject: ${subject}

Message:
${message}
    `.trim(),
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F8F6F1; border-radius: 16px; overflow: hidden; border: 1px solid rgba(201,153,40,0.2);">
        <!-- Header with gradient line -->
        <div style="background: linear-gradient(90deg, transparent, #C99928, transparent); height: 2px;"></div>
        <div style="padding: 40px 40px 32px; text-align: center; background: linear-gradient(135deg, #EFEFEB 0%, #F8F6F1 100%);">
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #0F1117; margin-bottom: 8px;">Dr. Christeen Youssef</div>
          <div style="font-size: 12px; color: #7A8094; letter-spacing: 1px;">Aesthetic Dermatology & Wellness</div>
          <div style="margin-top: 16px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #C99928;">New Contact Form Submission</div>
        </div>

        <!-- Divider -->
        <div style="margin: 0 40px; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,153,40,0.25), transparent);"></div>

        <!-- Contact details -->
        <div style="padding: 32px 40px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid rgba(15,17,23,0.06);">
                <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #7A8094; margin-bottom: 4px;">Name</div>
                <div style="font-size: 15px; color: #0F1117; font-weight: 600;">${escapeHtml(name)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid rgba(15,17,23,0.06);">
                <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #7A8094; margin-bottom: 4px;">Phone</div>
                <div style="font-size: 15px; color: #0F1117;">${escapeHtml(phone)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid rgba(15,17,23,0.06);">
                <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #7A8094; margin-bottom: 4px;">Email</div>
                <div style="font-size: 15px;"><a href="mailto:${escapeHtml(email)}" style="color: #C99928; text-decoration: none; font-weight: 500;">${escapeHtml(email)}</a></div>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 0; border-bottom: 1px solid rgba(15,17,23,0.06);">
                <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #7A8094; margin-bottom: 4px;">Subject</div>
                <div style="font-size: 15px; color: #0F1117; font-weight: 600;">${escapeHtml(subject)}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Message -->
        <div style="margin: 0 40px; padding: 24px; background: #FFFFFF; border-radius: 12px; border: 1px solid rgba(201,153,40,0.15);">
          <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #7A8094; margin-bottom: 12px;">Message</div>
          <div style="font-size: 14px; color: #1A1D23; line-height: 1.8; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>

        <!-- Footer -->
        <div style="padding: 32px 40px; text-align: center; background: linear-gradient(135deg, #F8F6F1 0%, #EFEFEB 100%);">
          <div style="margin-bottom: 16px; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,153,40,0.15), transparent);"></div>
          <div style="font-size: 11px; color: #7A8094; letter-spacing: 0.5px;">
            &copy; ${new Date().getFullYear()} Dr. Christeen Youssef &middot; Aesthetic Dermatology &middot; Abu Dhabi, UAE
          </div>
        </div>
      </div>
    `,
  };

  try {
    console.log('📤 Sending email to:', recipient);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return res.status(200).json({ success: true, message: 'Email sent successfully.', messageId: info.messageId });
  } catch (err) {
    console.error('❌ Nodemailer error:', err.message);
    console.error('   Error code:', err.code);
    console.error('   Command:', err.command);
    return res.status(500).json({ success: false, error: 'Failed to send email: ' + err.message });
  }
});

// ─── Get country from Cloudflare CF-IPCountry header ────────────────────────
app.get('/api/country', async (req, res) => {
  console.log('📍 Country detection request');
  console.log('   Headers:', {
    'cf-ipcountry': req.headers['cf-ipcountry'],
    'CF-IPCountry': req.headers['CF-IPCountry'],
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'x-real-ip': req.headers['x-real-ip'],
    'socket.remoteAddress': req.socket.remoteAddress,
  });

  // Try Cloudflare header first
  const cfCountry = req.headers['cf-ipcountry'] || req.headers['CF-IPCountry'];
  if (cfCountry) {
    console.log('   ✅ Using Cloudflare header:', cfCountry.toUpperCase());
    return res.json({ countryCode: cfCountry.toUpperCase() });
  }

  // Fallback to IP geolocation
  try {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.socket.remoteAddress;
    console.log('   🔍 Client IP:', clientIp);

    if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1') {
      // Use ipapi.co for IP geolocation (free tier)
      console.log('   🌐 Fetching country from ipapi.co for IP:', clientIp);
      const response = await fetch(`http://ipapi.co/${clientIp}/json/`);
      const data = await response.json();
      console.log('   📊 IP geolocation response:', data);

      if (data && data.country_code && data.country_code.length === 2) {
        console.log('   ✅ IP geolocation detected:', data.country_code.toUpperCase());
        return res.json({ countryCode: data.country_code.toUpperCase() });
      }
    } else {
      console.log('   ⚠️  Local IP detected, skipping IP geolocation');
    }
  } catch (error) {
    console.error('   ❌ IP geolocation failed:', error.message);
  }

  console.log('   ⚠️  Country detection failed, returning null');
  // Return null if detection fails
  res.json({ countryCode: null });
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Serve React frontend (must come after all API routes) ────────────────────
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ✦  Dr. Christeen Youssef server running at http://localhost:${PORT}\n`);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;');
}
