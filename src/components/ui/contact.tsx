import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/site/button';
import { Container, Section } from '@/components/site/layout';
import { PageHero } from '@/components/site/page-hero';
import { Input } from '@/components/ui/input';
import { PhoneField } from '@/components/ui/phone-field';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SocialLinks } from '@/components/site/social-links';
import { DIRECTIONS_URL, MapCard } from '@/components/site/map-card';
import { services } from '@/data/services';
import { schedule } from '@/data/schedule';
import { countries, type Country } from '@/data/countries';

interface ContactSectionProps {
  /** The page title. One word in braces is set in italic. */
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
  // The national part only — the dial code is a separate control and is
  // joined on at submit. Counted in digits so spaces and dashes are free, and
  // capped at E.164's 15 including the country code.
  phone: z
    .string()
    .trim()
    .min(1, 'Please enter a contact number.')
    .refine((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 5 && digits.length <= 15;
    }, 'Please enter a valid contact number.'),
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

/**
 * Where the dial code starts before anything is known about the reader.
 *
 * The clinic is in Abu Dhabi and most enquiries are local, so this is the right
 * guess far more often than a blank or an alphabetical first entry would be. It
 * is only a starting point: /api/country replaces it as soon as it answers.
 */
const FALLBACK_COUNTRY =
  countries.find((entry) => entry.code === 'AE') ?? countries[0];

const TEL = `tel:${schedule.phone.replace(/\s+/g, '')}`;


// The shared inputs, restated for the cream form card: 50px, a hairline, a
// gold focus ring.
const FIELD =
  'h-[50px] rounded-[10px] border-line bg-page px-4 type-body max-md:text-base text-ink transition-colors placeholder:text-caption focus-visible:border-gold focus-visible:ring-[3px] focus-visible:ring-gold/30 aria-invalid:border-destructive';

const FIELD_LABEL = 'type-eyebrow text-caption-strong';

const DARK_LABEL = 'type-eyebrow text-eyebrow-dark';

const CHIP =
  'flex size-10 shrink-0 items-center justify-center rounded-full border border-line-dark text-gold-light';

export function ContactSection({
  title = 'Every result starts with a {conversation}',
  mainMessage = "Let's talk",
  contactEmail = 'customer.service@everlastwellness.com',
}: ContactSectionProps) {
  // Kept outside the form state: these are Base UI checkboxes rather than
  // native inputs, so registering them would mean a Controller each, and they
  // are not part of what the server validates.
  const [interests, setInterests] = useState<string[]>([]);

  // Not part of what the server validates either: the dial code is joined onto
  // the number in onValid, so the API still receives one `phone` string.
  const [country, setCountry] = useState<Country>(FALLBACK_COUNTRY);
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

  // Ask where the reader is and preselect their dial code. Best-effort by
  // design: the route answers `null` off Cloudflare and on a local IP, and any
  // failure simply leaves the fallback in place — this must never be able to
  // stop the form rendering or block a submission.
  //
  // The setState is inside the promise rather than the effect body, so this is
  // a subscription to an external answer and not a cascading render.
  useEffect(() => {
    const abort = new AbortController();

    fetch('/api/country', { signal: abort.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { countryCode?: string | null } | null) => {
        const match = countries.find(
          (entry) => entry.code === data?.countryCode,
        );
        if (match) setCountry(match);
      })
      .catch(() => {
        // Aborted on unmount, offline, or the lookup failed. The fallback
        // stands either way.
      });

    return () => abort.abort();
  }, []);

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
        body: JSON.stringify({
        ...values,
        // The two halves rejoined. Sent with a space rather than run together,
        // so the number is readable in the inbox and still dials.
        phone: `${country.dialCode} ${values.phone.trim()}`,
        message,
        subject: SUBJECT,
      }),
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
    <>
      <PageHero section="/reach-me" title={title} />

      <Section tone="page">
        <Container className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* ---------------- Left: the clinic, and the ways round the form ---------------- */}
          <aside
            data-tone="ink"
            aria-label="Clinic details"
            className="flex flex-col rounded-[16px] bg-ink p-7 text-white sm:p-10"
          >
            <dl className="space-y-7 type-body">
              <div>
                <dt className="flex items-center gap-4">
                  <span className={CHIP}>
                    <MapPin aria-hidden strokeWidth={1.6} className="size-[17px]" />
                  </span>
                  <span className={DARK_LABEL}>Clinic</span>
                </dt>
                <dd className="mt-1 pl-14 text-white/75">
                    <span className="block font-semibold text-white">{schedule.clinicName}</span>
                    <a
                      href={DIRECTIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/25 underline-offset-4 transition-colors hover-fine:text-white hover-fine:decoration-gold-light"
                    >
                      {schedule.address}
                    </a>
                  </dd>
              </div>

              <div>
                <dt className="flex items-center gap-4">
                  <span className={CHIP}>
                    <Clock aria-hidden strokeWidth={1.6} className="size-[17px]" />
                  </span>
                  <span className={DARK_LABEL}>Hours</span>
                </dt>
                <dd className="mt-1 pl-14 text-white/75">
                    {schedule.workingDays[0]} &ndash;{' '}
                    {schedule.workingDays[schedule.workingDays.length - 1]} &middot;{' '}
                    {schedule.hours}
                  </dd>
              </div>

              <div>
                <dt className="flex items-center gap-4">
                  <span className={CHIP}>
                    <Phone aria-hidden strokeWidth={1.6} className="size-[17px]" />
                  </span>
                  <span className={DARK_LABEL}>Direct</span>
                </dt>
                <dd className="mt-1 pl-14 flex flex-col gap-1 text-white/75">
                    <a href={TEL} className="transition-colors hover-fine:text-white">
                      {schedule.phone}
                    </a>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="break-all transition-colors hover-fine:text-white"
                    >
                      {contactEmail}
                    </a>
                  </dd>
              </div>
            </dl>

            <SocialLinks tone="dark" className="mt-9" />

            {/* A drawn plan, not an embed: no Google Maps scripts, frames or tiles. */}
            <MapCard className="mt-9" />
          </aside>

          {/* ---------------- Right: the form ---------------- */}
          <div className="rounded-[16px] border border-line bg-cream p-6 sm:p-10">
            <h2 className="type-h2 text-ink">{mainMessage}</h2>

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
                  <PhoneField
                    id="phone"
                    country={country}
                    onCountryChange={setCountry}
                    invalid={Boolean(errors.phone)}
                    inputProps={register('phone')}
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
                  className={`${FIELD} h-auto min-h-32 py-3`}
                  {...register('message')}
                />
                <FieldError message={errors.message?.message} />
              </div>

              <fieldset className="space-y-4">
                <legend className={FIELD_LABEL}>
                  I&apos;m interested in{' '}
                  <span className="font-normal tracking-normal normal-case">(optional)</span>
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
                        className="mt-0.5 border-ink/30 bg-page data-[checked]:border-gold-deep data-[checked]:bg-gold-deep data-[checked]:text-white"
                      />
                      <Label
                        htmlFor={service.id}
                        className="type-small font-normal text-soft"
                      >
                        {service.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </fieldset>

              <Button
                type="submit"
                variant="gold"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Sending…' : 'Send a message'}
              </Button>

              {/* aria-live so the outcome is announced: for anyone not watching
                  this corner of the screen, a silent swap is no feedback. */}
              <p
                aria-live="polite"
                className={`min-h-5 type-small ${
                  status?.ok ? 'text-gold-text' : 'text-destructive'
                }`}
              >
                {status?.text}
              </p>
            </form>
          </div>
        </Container>
      </Section>
    </>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="type-small text-destructive">{message}</p>;
}
