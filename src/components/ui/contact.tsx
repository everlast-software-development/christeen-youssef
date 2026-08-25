'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CtaSubmit } from '@/components/ui/cta-pill';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SocialIcon } from '@/components/icons/social-icon';
import { socialLinks } from '@/data/socials';
import { services } from '@/data/services';
import { schedule } from '@/data/schedule';
import banner from '@/assets/main-banner.webp';

interface ContactSectionProps {
  /** The headline beside the form. */
  title?: string;
  /** The form panel's own heading. */
  mainMessage?: string;
  /** Shown as a mailto beside the phone number. */
  contactEmail?: string;
}

/**
 * Mirrors the zod schema in app/api/contact/route.ts field for field, so the
 * form cannot accept anything the server will reject. `subject` is not here
 * because the reader never types one — see SUBJECT below.
 */
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  email: z.email('Please enter a valid email address.'),
  phone: z.string().trim().min(5, 'Please enter a contact number.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more — at least a sentence.'),
});

type ContactValues = z.infer<typeof contactSchema>;

/**
 * The API requires a subject and the design has no field for one. The upstream
 * component had the same gap — its checkbox group was "I'm looking for..." with
 * nothing to carry it — so the interests go into the message body, where the
 * email template will actually render them, and the subject is fixed.
 */
const SUBJECT = 'Consultation enquiry — website';

const TEL = `tel:${schedule.phone.replace(/\s+/g, '')}`;
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  schedule.address,
)}`;

// Dark-field versions of the shared inputs. The components are the project's
// own — only the surface is restated, because they default to the light shadcn
// tokens and this panel sits on a night photograph.
const FIELD =
  'h-11 rounded-xl border-cream/15 bg-cream/5 px-4 text-base text-cream transition-colors placeholder:text-cream/35 focus-visible:border-gold focus-visible:ring-gold/25 md:text-sm';

const FIELD_LABEL =
  'font-body text-[0.68rem] tracking-[0.18em] text-cream/55 uppercase';

export function ContactSection({
  title = 'Every result starts with a conversation',
  mainMessage = "Let's talk",
  contactEmail = 'customer.service@everlastwellness.com',
}: ContactSectionProps) {
  // Kept outside the form state: these are Base UI checkboxes rather than
  // native inputs, so registering them would mean a Controller each, and they
  // are not part of what the server validates.
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  const toggleInterest = (title: string, checked: boolean) =>
    setInterests((current) =>
      checked
        ? [...current, title]
        : current.filter((entry) => entry !== title),
    );

  const onValid = async (values: ContactValues) => {
    setStatus(null);

    const message = interests.length
      ? `${values.message}\n\nInterested in: ${interests.join(', ')}`
      : values.message;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, message, subject: SUBJECT }),
      });

      // The route answers 400 with `errors[]` and 500 with `error`, so both
      // shapes have to be read before falling back to something generic.
      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        setStatus({
          ok: false,
          text:
            body?.errors?.[0] ??
            body?.error ??
            'Something went wrong. Please try again, or call the clinic.',
        });
        return;
      }

      setStatus({
        ok: true,
        text: 'Thank you — your message is on its way. We will be in touch shortly.',
      });
      reset();
      setInterests([]);
    } catch {
      setStatus({
        ok: false,
        text: 'We could not reach the server. Please check your connection, or call the clinic.',
      });
    }
  };

  return (
    // A wrapper rather than a fragment so the whole page can carry the marker
    // that inverts the header — the probe lands on the fixed backdrop above the
    // content as often as on the content itself.
    <div data-header-surface="dark">
      {/* Fixed and behind everything, rather than a layer inside the section.
          Two reasons: it carries on under the footer, whose rounded top corners
          would otherwise cut two pale notches out of this dark page — see the
          backdrop note in footer-section.tsx — and being viewport-fixed it holds
          still while the content travels over it.

          A negative z-index still paints above the document background, so the
          body's white never shows through. */}
      <div aria-hidden className="fixed inset-0 -z-10 bg-ink">
        {/* next/image rather than a CSS background: it is the largest thing on
            the page, and this way it is sized, formatted and preloaded properly
            instead of being fetched by a url() the browser finds late. */}
        <Image
          src={banner}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* The photograph is a saturated purple-and-blue night shot, which
            fights the gold. The scrim holds it back far enough for cream text
            and a gold CTA to stay legible, and deepens toward the form side. */}
        <div className="absolute inset-0 bg-ink/65 lg:bg-gradient-to-r lg:from-ink/70 lg:via-ink/65 lg:to-ink/75" />
      </div>

      <div className="relative mx-auto grid max-w-[96rem] gap-12 px-5 pt-32 pb-24 md:px-8 lg:grid-cols-[1fr_minmax(0,44rem)] lg:gap-16 lg:px-12 lg:pt-40 lg:pb-32">
        {/* ---------------- Left: the ask, and the ways round it ---------------- */}
        <div className="flex flex-col justify-end">
          <p className="font-body text-[0.72rem] tracking-[0.24em] text-gold uppercase sm:text-[0.78rem]">
            Reach me
          </p>

          <h1 className="mt-5 max-w-[20ch] font-display text-display-md text-cream">
            {title}
          </h1>

          <div
            aria-hidden
            className="mt-7 h-px w-24 origin-left bg-gradient-gold"
          />

          <dl className="mt-10 space-y-6 font-body text-sm">
            <div>
              <dt className={FIELD_LABEL}>Clinic</dt>
              <dd className="mt-2 text-cream/75">
                {schedule.clinicName}
                <br />
                <a
                  href={DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  {schedule.address}
                </a>
              </dd>
            </div>

            <div>
              <dt className={FIELD_LABEL}>Hours</dt>
              <dd className="mt-2 text-cream/75">
                {schedule.workingDays[0]} &ndash;{' '}
                {schedule.workingDays[schedule.workingDays.length - 1]} &middot;{' '}
                {schedule.hours}
              </dd>
            </div>

            <div>
              <dt className={FIELD_LABEL}>Direct</dt>
              <dd className="mt-2 flex flex-col gap-1 text-cream/75">
                <a href={TEL} className="transition-colors hover:text-gold">
                  {schedule.phone}
                </a>
                <a
                  href={`mailto:${contactEmail}`}
                  className="transition-colors hover:text-gold"
                >
                  {contactEmail}
                </a>
              </dd>
            </div>
          </dl>

          {/* Inlined brand marks, not the CDN <img> tags the upstream snippet
              used — Lucide 1.x has no brand icons and a strict CSP would drop
              the jsdelivr requests anyway. */}
          <ul className="mt-10 flex flex-wrap gap-3">
            {socialLinks.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="flex size-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors duration-300 hover:border-gold/40 hover:text-gold"
                >
                  <SocialIcon platform={social.platform} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Right: the form ---------------- */}
        <div className="rounded-3xl border border-cream/12 bg-ink/70 p-6 backdrop-blur-xl md:p-9">
          <h2 className="font-display text-display-sm text-cream">
            {mainMessage}
          </h2>

          <form
            onSubmit={handleSubmit(onValid)}
            noValidate
            className="mt-8 space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className={FIELD_LABEL}>
                  Your name
                </Label>
                <Input
                  id="name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  className={FIELD}
                  {...register('name')}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={FIELD_LABEL}>
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  className={FIELD}
                  {...register('phone')}
                />
                <FieldError message={errors.phone?.message} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={FIELD_LABEL}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                className={FIELD}
                {...register('email')}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className={FIELD_LABEL}>
                How can we help?
              </Label>
              <Textarea
                id="message"
                rows={4}
                placeholder="Tell us briefly what you would like to treat, and anything relevant about your history."
                aria-invalid={Boolean(errors.message)}
                className={`${FIELD} h-auto min-h-28 py-3`}
                {...register('message')}
              />
              <FieldError message={errors.message?.message} />
            </div>

            {/* The upstream "I'm looking for..." group, with the real service
                list in place of the agency options it shipped with. */}
            <fieldset className="space-y-4">
              <legend className={FIELD_LABEL}>
                I&apos;m interested in{' '}
                <span className="tracking-normal normal-case">(optional)</span>
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div key={service.id} className="flex items-start gap-2.5">
                    <Checkbox
                      id={service.id}
                      checked={interests.includes(service.title)}
                      onCheckedChange={(checked) =>
                        toggleInterest(service.title, checked)
                      }
                      className="mt-0.5 border-cream/25 data-[checked]:border-gold data-[checked]:bg-gold data-[checked]:text-ink"
                    />
                    <Label
                      htmlFor={service.id}
                      className="font-body text-[0.82rem] leading-snug font-normal text-cream/70"
                    >
                      {service.title}
                    </Label>
                  </div>
                ))}
              </div>
            </fieldset>

            <CtaSubmit label="Send a message" pending={isSubmitting} />

            {/* aria-live so the outcome is announced: for anyone not watching
                this corner of the screen, a silent swap is no feedback. */}
            <p
              aria-live="polite"
              className={`min-h-5 font-body text-[0.82rem] ${
                status?.ok ? 'text-gold' : 'text-red-300'
              }`}
            >
              {status?.text}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="font-body text-[0.75rem] text-red-300">{message}</p>;
}
