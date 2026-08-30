import type { ReactNode } from 'react';
import type { StaticImageData } from 'next/image';
import { Check } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArticleFigure } from '@/components/blog/article-figure';
import type { Block, Section } from '@/lib/blog-content';
import type { SectionFigure } from '@/types';

/** `**bold**` and `[text](url)`. Nothing else appears inline in the content. */
const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((part, index) => {
      const bold = part.match(/^\*\*([^*]+)\*\*$/);
      if (bold) {
        return (
          <strong key={index} className="font-medium text-ink">
            {bold[1]}
          </strong>
        );
      }

      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return (
          <a
            key={index}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            // break-words because one of these labels is a bare YouTube URL,
            // which has no space in it to wrap on.
            className="font-medium break-words text-gold-dark underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold"
          >
            {link[1]}
          </a>
        );
      }

      return part;
    });
}

/** `Background: …` — the abstract's own structure, worth keeping visible. */
function AbstractParagraph({ text }: { text: string }) {
  const match = text.match(/^([A-Z][A-Za-z ]{2,20}):\s*(.*)$/);

  if (!match) {
    return (
      <p className="font-body text-[0.95rem]/relaxed text-ink-soft">
        {renderInline(text)}
      </p>
    );
  }

  const [, label, rest] = match;

  return (
    <p className="font-body text-[0.95rem]/relaxed text-ink-soft">
      <span className="mr-2 font-body text-[0.7rem] tracking-[0.18em] text-gold-dark uppercase">
        {label}
      </span>
      {renderInline(rest)}
    </p>
  );
}

function Blocks({
  blocks,
  lead = false,
}: {
  blocks: Block[];
  /**
   * Set on the standfirst only. Its opening paragraph is set larger than body
   * copy, the way a magazine sets a standfirst — it is the sentence that decides
   * whether the rest gets read, and at four of these nine posts' length it is a
   * meaningful share of the article.
   */
  lead?: boolean;
}) {
  return blocks.map((block, index) => {
    if (block.kind === 'heading') {
      return (
        <h3
          key={index}
          className="mt-12 font-display text-2xl/snug text-ink first:mt-0"
        >
          {block.text}
        </h3>
      );
    }

    if (block.kind === 'case') {
      return (
        <div
          key={index}
          data-reveal
          className="relative my-8 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 p-7 lg:p-8"
        >
          {/* The number again, oversized and faint. It is what makes a run of
              these read as a numbered series at a glance rather than as three
              more panels. aria-hidden because the label below says it properly. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-4 right-4 font-display text-[5.5rem]/none text-gold/10 select-none"
          >
            {block.label.replace(/\D/g, '')}
          </span>

          <span className="font-body text-[0.68rem] tracking-[0.22em] text-gold-dark uppercase">
            {block.label}
          </span>

          {block.title && (
            <h4 className="mt-3 font-display text-xl/snug text-ink">
              {block.title}
            </h4>
          )}

          {block.body.map((text, i) => (
            <p
              key={i}
              className="mt-3 font-body text-[0.98rem]/relaxed text-ink-soft"
            >
              {renderInline(text)}
            </p>
          ))}
        </div>
      );
    }

    if (block.kind === 'quote') {
      return (
        <blockquote
          key={index}
          data-reveal
          className="my-12 border-l-2 border-gold/60 pl-6 font-display text-2xl/relaxed text-ink italic lg:text-[1.7rem]/relaxed"
        >
          {renderInline(block.text)}
        </blockquote>
      );
    }

    if (block.kind === 'list') {
      return (
        <ul key={index} data-reveal className="my-8 space-y-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4">
              <span
                aria-hidden
                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold"
              />
              <span className="font-body text-[0.98rem]/relaxed text-ink-soft">
                {item.lead && (
                  <span className="font-medium text-ink">{item.lead}. </span>
                )}
                {renderInline(item.text)}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p
        key={index}
        className={
          lead && index === 0
            ? 'my-6 font-body text-[1.18rem]/relaxed text-ink lg:text-[1.28rem]/relaxed'
            : 'my-6 font-body text-[1.02rem]/relaxed text-ink-soft'
        }
      >
        {renderInline(block.text)}
      </p>
    );
  });
}

function SectionShell({
  section,
  number,
  figures,
  children,
}: {
  section: Section;
  /** `01`, or null where the article is too short to be worth numbering. */
  number: string | null;
  /** Every figure belonging to this section, not just the first. */
  figures: SectionFigure[];
  children: ReactNode;
}) {
  return (
    // The id and scroll-mt are what the contents list jumps to; the margin
    // clears the fixed header so a heading never lands under it.
    //
    // The gap between sections is here, on the section, not on the h2 where it
    // was. An h2 is always its section's first child, so `first:mt-0` matched
    // every single one of them and the mt-16 never applied — every heading on
    // every article sat hard against the paragraph above it.
    <section
      id={section.id}
      data-section
      className="scroll-mt-28 [&:not(:first-child)]:mt-16"
    >
      {section.heading && (
        <>
          {number && (
            <span
              data-reveal
              className="block font-body text-[0.72rem] tracking-[0.22em] text-gold-dark tabular-nums"
            >
              {number}
              <span aria-hidden className="mx-2 text-gold/40">
                /
              </span>
            </span>
          )}

          <h2
            data-reveal-heading
            className={`font-display text-display-sm text-ink ${
              number ? 'mt-3' : ''
            }`}
          >
            {section.heading}
          </h2>
        </>
      )}
      {/* flow-root, so a figure taller than its own section's copy is
          contained here instead of spilling across the next heading. A BFC
          rather than overflow-hidden: this section is what the contents list
          scrolls to, and clipping it would clip the scroll margin with it. */}
      {figures.length > 0 ? (
        <div className="flow-root">
          {/* Before the copy in document order — a float only affects the
              content that follows it. */}
          {figures.map((figure, index) => (
            <ArticleFigure
              key={index}
              image={figure.image}
              side={figure.side}
              alt={figure.alt}
              crop={figure.crop}
              focus={figure.focus}
              width={figure.width}
            />
          ))}
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function SectionContent({
  section,
  lead = false,
}: {
  section: Section;
  lead?: boolean;
}) {
  // ---- Takeaways: the one section people screenshot, so it gets a card ----
  if (section.variant === 'takeaways') {
    const items = section.blocks.flatMap((block) =>
      block.kind === 'list' ? block.items : [],
    );
    const rest = section.blocks.filter((block) => block.kind !== 'list');

    return (
      <>
        {rest.length > 0 && <Blocks blocks={rest} />}

        <ul data-reveal className="mt-8 grid gap-4 rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/8 to-transparent p-7 lg:p-8">
          {items.map((item, index) => (
            <li key={index} className="flex gap-4">
              <Check
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-gold-dark"
              />
              <span className="font-body text-[0.98rem]/relaxed text-ink-soft">
                {item.lead && (
                  <span className="font-medium text-ink">{item.lead}. </span>
                )}
                {renderInline(item.text)}
              </span>
            </li>
          ))}
        </ul>
      </>
    );
  }

  // ---- References: a citation list, not body copy ----
  if (section.variant === 'references') {
    const items = section.blocks.flatMap((block) =>
      block.kind === 'list' ? block.items : [],
    );

    return (
      <ol data-reveal className="mt-8 space-y-3 rounded-2xl bg-cream-dark/60 p-7 lg:p-8">
        {items.map((item, index) => (
          <li key={index} className="flex gap-4">
            <span
              aria-hidden
              className="shrink-0 font-body text-[0.72rem] tabular-nums text-gold-dark"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-body text-[0.82rem]/relaxed text-slate">
              {renderInline(item.text)}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  // ---- Abstract: keep the paper's own Background/Methods/Results shape ----
  if (section.variant === 'abstract') {
    return (
      <div data-reveal className="mt-8 space-y-5 rounded-2xl border border-ink/10 bg-white/50 p-7 lg:p-8">
        {section.blocks.map((block, index) =>
          block.kind === 'paragraph' ? (
            <AbstractParagraph key={index} text={block.text} />
          ) : null,
        )}
      </div>
    );
  }

  // ---- FAQ: eight headings in a row is a list, so it behaves like one ----
  if (section.variant === 'faq' && section.faqs) {
    return (
      <Accordion data-reveal className="mt-8">
        {section.faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left font-body text-[0.98rem] text-ink">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              {faq.answer.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-body text-[0.95rem]/relaxed text-ink-soft"
                >
                  {renderInline(paragraph)}
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return <Blocks blocks={section.blocks} lead={lead} />;
}

/**
 * Sections below which numbering is decoration.
 *
 * Two, matching TOC_MIN_ITEMS at the call site, and for the same reason: the
 * numbers and the contents rail are one device seen twice, so a post that shows
 * `03 /` beside a heading has `03` to point at in the rail, and a post with
 * neither has genuinely nothing to number. Set at four, the two disagreed —
 * three articles carried a contents rail listing headings that were not
 * numbered on the page the rail was for.
 */
const NUMBERING_MIN_SECTIONS = 2;

/** Roughly how many characters of copy a section has for a float to wrap. */
function measureOf(section: Section) {
  return section.blocks.reduce((total, block) => {
    if (block.kind === 'paragraph' || block.kind === 'quote') {
      return total + block.text.length;
    }
    if (block.kind === 'case') return total + block.body.join(' ').length;
    if (block.kind === 'list') {
      return (
        total +
        block.items.reduce(
          (sum, item) => sum + (item.lead?.length ?? 0) + item.text.length,
          0,
        )
      );
    }
    return total;
  }, 0);
}

/**
 * Gives every gallery photograph a section to sit in.
 *
 * The gallery used to be a column of its own beside the copy, and before that a
 * band underneath it. Both read as an appendix — a strip of pictures the article
 * had finished with — when on the event posts the photographs *are* the article:
 * they are what happened. So they go where the authored figures go, floated into
 * the prose with the copy running past them.
 *
 * Which section gets which picture is decided by how much copy the section has,
 * not by spacing them evenly down the page. A float only reads as a float if the
 * text closes back underneath it, and that is a question of whether there are
 * enough lines beside the frame to clear it — so the longest sections take the
 * pictures. Sections `figures` has already claimed are out: the author put a
 * photograph there for a reason, and a second one would stack against it.
 */
function placeGallery(
  sections: Section[],
  authored: SectionFigure[],
  gallery: StaticImageData[],
): SectionFigure[] {
  if (gallery.length === 0) return [];

  const claimed = new Set(authored.map((entry) => entry.section));

  // Headed sections only. The standfirst is the sentence that decides whether
  // the rest gets read, and it is set as a lead — a float in the first two
  // lines of the article is competing with it.
  const open = sections.filter(
    (section) => section.heading && !claimed.has(section.id),
  );

  if (open.length === 0) return [];

  // The roomiest sections, put back into reading order so the pictures are met
  // in the order the post lists them.
  const roomiest = new Set(
    [...open]
      .sort((a, b) => measureOf(b) - measureOf(a))
      .slice(0, gallery.length),
  );
  const chosen = open.filter((section) => roomiest.has(section));

  return gallery.map((image, index) => ({
    // More pictures than sections doubles them up on the last one rather than
    // dropping any — SectionShell renders every figure it is given.
    section: (chosen[index] ?? open[open.length - 1]).id,
    image,
  }));
}

export function ArticleBody({
  sections,
  figures = [],
  gallery = [],
}: {
  sections: Section[];
  figures?: SectionFigure[];
  gallery?: StaticImageData[];
}) {
  // Counted over headed sections only — the standfirst has no heading and must
  // not consume 01.
  const headed = sections.filter((section) => section.heading).length;
  const numbered = headed >= NUMBERING_MIN_SECTIONS;

  // Worked out up front rather than inside the map, because the count runs over
  // headed sections while the map runs over all of them — a standfirst sits in
  // the list too, and incrementing during the render would number it.
  let position = 0;
  const numbers = sections.map((section) =>
    numbered && section.heading ? String(++position).padStart(2, '0') : null,
  );

  // Authored placements and spread-out gallery frames are the same thing from
  // here on: a picture that belongs to a section.
  const order = new Map(sections.map((section, index) => [section.id, index]));
  const placed = [...figures, ...placeGallery(sections, figures, gallery)].sort(
    (a, b) => (order.get(a.section) ?? 0) - (order.get(b.section) ?? 0),
  );

  // Sides alternate down the whole article, so two frames never stack against
  // the same margin. Done over the merged list in document order rather than
  // per post in the data, which is how it used to be kept — by hand, and only
  // correct for as long as nobody inserted a picture in the middle.
  const sided: SectionFigure[] = [];
  for (const figure of placed) {
    const previous = sided[sided.length - 1]?.side;
    sided.push({
      ...figure,
      side: figure.side ?? (previous === 'right' ? 'left' : 'right'),
    });
  }

  return (
    <div>
      {sections.map((section, index) => (
        <SectionShell
          key={section.id || index}
          section={section}
          number={numbers[index]}
          figures={sided.filter((entry) => entry.section === section.id)}
        >
          <SectionContent section={section} lead={index === 0} />
        </SectionShell>
      ))}
    </div>
  );
}
