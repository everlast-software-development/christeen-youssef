import type { ReactNode } from 'react';
import type { StaticImageData } from '@/components/ui/image';
import { Check } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArticleFigure, type ArticleImage } from '@/components/blog/article-figure';
import type { Block, Section } from '@/lib/blog-content';
import type { SectionFigure } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Body copy: Manrope 17px on 1.75, in the article's own ink (--prose, 10:1 on
 * cream), paragraphs 1.25em apart. Everything in the body that reads as text
 * — lists, cards, answers — uses it, so the article is one voice.
 */
const PROSE = 'font-body text-[17px] leading-[1.75] text-prose';
const PARAGRAPH = cn(PROSE, 'm-0 mt-[1.25em] first:mt-0');
/** The opening paragraph: a size up, in ink. */
const LEAD = 'm-0 font-body text-lg leading-[1.65] text-ink lg:text-xl';
const LINK =
  'font-medium break-words text-gold-text underline decoration-gold/50 underline-offset-4 transition-colors hover-fine:text-ink hover-fine:decoration-gold';

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
          <strong key={index} className="font-semibold text-ink">
            {bold[1]}
          </strong>
        );
      }

      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        // break-words: one of these labels is a bare YouTube URL.
        return (
          <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className={LINK}>
            {link[1]}
          </a>
        );
      }

      return part;
    });
}

function Bullet() {
  return <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-gold" />;
}

/** `Background: …` — the abstract's own structure, worth keeping visible. */
function AbstractParagraph({ text }: { text: string }) {
  const match = text.match(/^([A-Z][A-Za-z ]{2,20}):\s*(.*)$/);
  if (!match) return <p className={PARAGRAPH}>{renderInline(text)}</p>;

  const [, label, rest] = match;
  return (
    <p className={PARAGRAPH}>
      <span className="mr-2 type-eyebrow text-gold-text">{label}</span>
      {renderInline(rest)}
    </p>
  );
}

function Blocks({ blocks, lead = false }: { blocks: Block[]; lead?: boolean }) {
  return blocks.map((block, index) => {
    if (block.kind === 'heading') {
      return (
        <h3 key={index} className="m-0 mt-10 mb-4 font-display text-[1.5rem] leading-[1.25] font-medium text-ink first:mt-0">
          {block.text}
        </h3>
      );
    }

    if (block.kind === 'case') {
      return (
        <div
          key={index}
          data-reveal
          className="relative my-8 overflow-hidden rounded-card border border-line bg-page p-7 lg:p-8"
        >
          {/* The number again, oversized and faint — what makes a run of these
              read as a numbered series. aria-hidden: the label says it. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-4 right-4 font-display text-[5.5rem]/none text-gold/20 select-none"
          >
            {block.label.replace(/\D/g, '')}
          </span>
          <span className="type-eyebrow text-caption-strong">{block.label}</span>
          {block.title && (
            <h4 className="m-0 mt-3 font-display text-[1.5rem] leading-[1.25] font-medium text-ink">{block.title}</h4>
          )}
          {block.body.map((text, i) => (
            <p key={i} className={cn(PROSE, 'm-0 mt-3')}>
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
          className="mx-0 my-10 border-l-2 border-gold pl-6 font-display text-[length:clamp(1.375rem,2vw,1.625rem)] leading-[1.4] text-ink italic"
        >
          {renderInline(block.text)}
        </blockquote>
      );
    }

    if (block.kind === 'list') {
      return (
        <ul key={index} className="m-0 mt-[1.25em] list-none space-y-3 p-0">
          {block.items.map((item, i) => (
            <li key={i} className={cn(PROSE, 'flex gap-4')}>
              <Bullet />
              <span>
                {item.lead && <span className="font-semibold text-ink">{item.lead}. </span>}
                {renderInline(item.text)}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className={lead && index === 0 ? LEAD : PARAGRAPH}>
        {renderInline(block.text)}
      </p>
    );
  });
}

function SectionContent({ section, lead = false }: { section: Section; lead?: boolean }) {
  // ---- Takeaways: the one section people screenshot, so it gets a card ----
  if (section.variant === 'takeaways') {
    const items = section.blocks.flatMap((block) => (block.kind === 'list' ? block.items : []));
    const rest = section.blocks.filter((block) => block.kind !== 'list');

    return (
      <>
        {rest.length > 0 && <Blocks blocks={rest} />}
        <ul data-reveal className="m-0 mt-8 grid list-none gap-4 rounded-card border border-line bg-page p-7 lg:p-8">
          {items.map((item, index) => (
            <li key={index} className={cn(PROSE, 'flex gap-4')}>
              <Check aria-hidden className="mt-[0.4em] size-4 shrink-0 text-gold-text" />
              <span>
                {item.lead && <span className="font-semibold text-ink">{item.lead}. </span>}
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
    const items = section.blocks.flatMap((block) => (block.kind === 'list' ? block.items : []));
    return (
      <ol data-reveal className="m-0 mt-8 list-none space-y-3 rounded-card bg-page p-7 lg:p-8">
        {items.map((item, index) => (
          <li key={index} className="flex gap-4">
            <span aria-hidden className="shrink-0 type-small text-gold-text tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="type-small text-prose">{renderInline(item.text)}</span>
          </li>
        ))}
      </ol>
    );
  }

  // ---- Abstract: keep the paper's own Background/Methods/Results shape ----
  if (section.variant === 'abstract') {
    return (
      <div data-reveal className="mt-8 rounded-card border border-line bg-page p-7 lg:p-8">
        {section.blocks.map((block, index) =>
          block.kind === 'paragraph' ? <AbstractParagraph key={index} text={block.text} /> : null,
        )}
      </div>
    );
  }

  // ---- FAQ: eight headings in a row is a list, so it behaves like one ----
  if (section.variant === 'faq' && section.faqs) {
    return (
      <Accordion data-reveal className="mt-6">
        {section.faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left font-body text-[17px] font-medium text-ink">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              {faq.answer.map((paragraph, index) => (
                <p key={index} className={PARAGRAPH}>
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
 * Sections below which numbering is decoration — the same threshold as the
 * contents list, because the numbers and the list are one device seen twice.
 */
const NUMBERING_MIN_SECTIONS = 2;

/** Roughly how much copy a section has. */
function measureOf(section: Section) {
  return section.blocks.reduce((total, block) => {
    if (block.kind === 'paragraph' || block.kind === 'quote') return total + block.text.length;
    if (block.kind === 'case') return total + block.body.join(' ').length;
    if (block.kind === 'list') {
      return total + block.items.reduce((sum, item) => sum + (item.lead?.length ?? 0) + item.text.length, 0);
    }
    return total;
  }, 0);
}

/**
 * Every photograph in the article, by section, numbered in reading order for
 * the lightbox (from `first`, so the cover can be 0).
 *
 * Authored `figures` go to the section they name. The `gallery` — pictures
 * nobody has tied to a passage — stays together as one group, a grid in the
 * roomiest headed section the figures have not already claimed (the
 * standfirst on a post with no headings), so a gallery reads as a gallery.
 */
export function placeImages(
  sections: Section[],
  figures: SectionFigure[] = [],
  gallery: StaticImageData[] = [],
  first = 0,
) {
  const placed: { section: string; image: Omit<ArticleImage, 'index'> }[] = figures.map((figure) => ({
    section: figure.section,
    image: { image: figure.image, alt: figure.alt, caption: figure.caption, focus: figure.focus },
  }));

  if (gallery.length && sections.length) {
    const claimed = new Set(figures.map((figure) => figure.section));
    const open = sections.filter((section) => section.heading && !claimed.has(section.id));
    const home = open.length
      ? [...open].sort((a, b) => measureOf(b) - measureOf(a))[0]
      : sections[sections.length - 1];
    for (const image of gallery) placed.push({ section: home.id, image: { image } });
  }

  // Reading order: by section, then as authored.
  const order = new Map(sections.map((section, index) => [section.id, index]));
  const sorted = placed
    .map((entry, authored) => ({ ...entry, authored }))
    .sort((a, b) => (order.get(a.section) ?? 0) - (order.get(b.section) ?? 0) || a.authored - b.authored);

  const bySection = new Map<string, ArticleImage[]>();
  const all: ArticleImage[] = [];
  sorted.forEach((entry, position) => {
    const item = { ...entry.image, index: first + position };
    all.push(item);
    bySection.set(entry.section, [...(bySection.get(entry.section) ?? []), item]);
  });

  return { bySection, all };
}

export function ArticleBody({
  sections,
  images,
  onOpenImage,
}: {
  sections: Section[];
  /** From placeImages. */
  images: Map<string, ArticleImage[]>;
  onOpenImage: (index: number) => void;
}) {
  // Counted over headed sections only — the standfirst has no heading and must
  // not consume 01.
  const headed = sections.filter((section) => section.heading).length;
  const numbered = headed >= NUMBERING_MIN_SECTIONS;
  let position = 0;
  const numbers = sections.map((section) =>
    numbered && section.heading ? String(++position).padStart(2, '0') : null,
  );

  return (
    <div>
      {sections.map((section, index) => {
        const pictures = images.get(section.id) ?? [];
        return (
          // The id is what the contents list jumps to; html's scroll-padding-top
          // lands it below the header.
          <section
            key={section.id || index}
            id={section.id}
            data-section
            className="[&:not(:first-child)]:mt-16"
          >
            {section.heading && (
              <>
                {numbers[index] && (
                  <span aria-hidden className="mb-3 block font-display text-[2.25rem] leading-none text-gold-text lining-nums tabular-nums">
                    {numbers[index]}
                  </span>
                )}
                <h2 data-reveal-heading className="m-0 mb-5 type-h3 text-ink">
                  {section.heading}
                </h2>
              </>
            )}
            <SectionContent section={section} lead={index === 0} />
            {pictures.length > 0 && <ArticleFigure images={pictures} onOpen={onOpenImage} />}
          </section>
        );
      })}
    </div>
  );
}
