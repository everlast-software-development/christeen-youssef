import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import {
  renderContactEmail,
  renderContactText,
  type ContactSubmission,
} from '@/lib/email-template';

// Same rules the Express handler enforced, expressed as a schema so the
// error shape is consistent and the payload is typed on the way through.
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Invalid name.'),
  phone: z.string().trim().min(5, 'Invalid phone.'),
  email: z.email('Invalid email.'),
  subject: z.string().trim().min(2, 'Invalid subject.'),
  message: z.string().trim().min(10, 'Message too short.'),
});

let transporter: nodemailer.Transporter | null = null;

// Built lazily so a missing SMTP config can't break the build or cold start.
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

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
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

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully.',
      messageId: info.messageId,
    });
  } catch (error) {
    // Log server-side, but don't leak SMTP details to the client.
    console.error('Contact form send failed:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 },
    );
  }
}
