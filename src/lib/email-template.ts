const escapeHtml = (value: string) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

export type ContactSubmission = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const row = (label: string, value: string) => `
  <tr>
    <td style="padding: 14px 0; border-bottom: 1px solid rgba(15,17,23,0.06);">
      <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #7A8094; margin-bottom: 4px;">${label}</div>
      <div style="font-size: 15px; color: #0F1117;">${value}</div>
    </td>
  </tr>`;

/** Branded HTML notification sent to the clinic on each contact submission. */
export function renderContactEmail(data: ContactSubmission, year: number) {
  const name = escapeHtml(data.name);
  const phone = escapeHtml(data.phone);
  const email = escapeHtml(data.email);
  const subject = escapeHtml(data.subject);
  const message = escapeHtml(data.message);

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F8F6F1; border-radius: 16px; overflow: hidden; border: 1px solid rgba(201,153,40,0.2);">
      <div style="background: linear-gradient(90deg, transparent, #C99928, transparent); height: 2px;"></div>

      <div style="padding: 40px 40px 32px; text-align: center; background: linear-gradient(135deg, #EFEFEB 0%, #F8F6F1 100%);">
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #0F1117; margin-bottom: 8px;">Dr. Christeen Youssef</div>
        <div style="font-size: 12px; color: #7A8094; letter-spacing: 1px;">Aesthetic Dermatology &amp; Wellness</div>
        <div style="margin-top: 16px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #C99928;">New Contact Form Submission</div>
      </div>

      <div style="margin: 0 40px; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,153,40,0.25), transparent);"></div>

      <div style="padding: 32px 40px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${row('Name', `<strong style="font-weight: 600;">${name}</strong>`)}
          ${row('Phone', phone)}
          ${row('Email', `<a href="mailto:${email}" style="color: #C99928; text-decoration: none; font-weight: 500;">${email}</a>`)}
          ${row('Subject', `<strong style="font-weight: 600;">${subject}</strong>`)}
        </table>
      </div>

      <div style="margin: 0 40px; padding: 24px; background: #FFFFFF; border-radius: 12px; border: 1px solid rgba(201,153,40,0.15);">
        <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #7A8094; margin-bottom: 12px;">Message</div>
        <div style="font-size: 14px; color: #1A1D23; line-height: 1.8; white-space: pre-wrap;">${message}</div>
      </div>

      <div style="padding: 32px 40px; text-align: center; background: linear-gradient(135deg, #F8F6F1 0%, #EFEFEB 100%);">
        <div style="margin-bottom: 16px; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,153,40,0.15), transparent);"></div>
        <div style="font-size: 11px; color: #7A8094; letter-spacing: 0.5px;">
          &copy; ${year} Dr. Christeen Youssef &middot; Aesthetic Dermatology &middot; Abu Dhabi, UAE
        </div>
      </div>
    </div>`;
}

export function renderContactText(data: ContactSubmission) {
  return `Name:    ${data.name}
Phone:   ${data.phone}
Email:   ${data.email}
Subject: ${data.subject}

Message:
${data.message}`;
}
