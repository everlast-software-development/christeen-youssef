import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import {
  renderContactEmail,
  renderContactText,
  type ContactSubmission,
} from '../src/lib/email-template';

// The contact form's fields, validated server-side whatever the client did.
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Invalid name.'),
  phone: z.string().trim().min(5, 'Invalid phone.'),
  email: z.email('Invalid email.'),
  subject: z.string().trim().min(2, 'Invalid subject.'),
  message: z.string().trim().min(10, 'Message too short.'),
});

let transporter: nodemailer.Transporter | null = null;

// Built lazily so a missing SMTP config can't break start-up.
function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    requireTLS: true,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}

/** POST /api/contact — validate, then deliver the enquiry by SMTP. */
export async function contact(request: Request, response: Response) {
  const parsed = contactSchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({
      success: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    });
    return;
  }

  const data: ContactSubmission = parsed.data;
  const recipient = process.env.EMAIL_TO ?? 'customer.service@everlastwellness.com';

  try {
    const info = await getTransporter().sendMail({
      from: `"Dr. Christeen Youssef" <${process.env.EMAIL_USER}>`,
      to: recipient,
      replyTo: data.email,
      subject: `${data.subject} — ${data.name}`,
      text: renderContactText(data),
      html: renderContactEmail(data, new Date().getFullYear()),
    });

    response.json({
      success: true,
      message: 'Email sent successfully.',
      messageId: info.messageId,
    });
  } catch (error) {
    // Log server-side, but don't leak SMTP details to the client.
    console.error('Contact form send failed:', error);
    response.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
}
