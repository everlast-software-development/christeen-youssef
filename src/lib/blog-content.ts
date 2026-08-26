/**
 * Turns a post's `content` string into typed sections.
 *
 * Hand-written rather than a markdown dependency because the syntax in
 * data/blog.ts is a closed set — `##`, `###`, `- `, `**bold**` and one link —
 * and because the point here is not generic markdown. It is recognising the
 * *kinds* of section the articles actually contain (an FAQ, a takeaways list, a
 * reference list, a paper abstract) so each can be given a treatment of its own
 * instead of all becoming the same run of paragraphs. A markdown library would
 * flatten exactly the distinction the layout depends on.
 */

export type ListItem = {
  /** The `**Lead-in:**` half of a definition-style bullet, if there is one. */
  lead?: string;
  text: string;
};

/**
 * A `### Case 1: The Glass Accident` heading and the paragraphs under it.
 *
 * Recognised as its own kind because these are the evidence in the clinical
 * talks, and as plain `###` headings they looked like any other subheading — the
 * three cases in the ISDS piece were indistinguishable from "Laser Safety".
 */
export type CaseStudy = {
  /** `Case 1` — the label as written, so the numbering is the author's. */
  label: string;
  title?: string;
  body: string[];
};

export type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'list'; items: ListItem[] }
  | ({ kind: 'case' } & CaseStudy);

export type SectionVariant =
  | 'prose'
  | 'faq'
  | 'takeaways'
  | 'references'
  | 'abstract';

export type Section = {
  id: string;
  /** Null for the standfirst — the text before the first `##`. */
  heading: string | null;
  variant: SectionVariant;
  blocks: Block[];
  /** Only on `faq` sections: the `###` questions with their answers. */
  faqs?: { id: string; question: string; answer: string[] }[];
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** A definition bullet: `**Something:** the rest of it`. */
function parseListItem(raw: string): ListItem {
  const match = raw.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
  if (!match) return { text: raw };

  const [, lead, rest] = match;
  return rest ? { lead: lead.replace(/:$/, ''), text: rest } : { text: lead };
}

function classify(heading: string | null): SectionVariant {
  if (!heading) return 'prose';

  const value = heading.toLowerCase();

  if (value.includes('frequently asked') || value === 'faq') return 'faq';
  if (value.includes('takeaway') || value.includes('practical advice')) {
    return 'takeaways';
  }
  if (value.startsWith('reference')) return 'references';
  if (value.startsWith('abstract')) return 'abstract';

  return 'prose';
}

export function parseArticle(content: string): Section[] {
  const sections: Section[] = [];

  let current: Section = {
    id: 'standfirst',
    heading: null,
    variant: 'prose',
    blocks: [],
  };

  // Buffers, flushed whenever the run of like lines ends.
  let paragraph: string[] = [];
  let list: ListItem[] = [];

  /**
   * The case block currently collecting paragraphs, if any. It has already been
   * pushed into `current.blocks` — this is the same object, mutated in place, so
   * the paragraphs land inside the card rather than after it.
   */
  let openCase: (Block & { kind: 'case' }) | null = null;

  const flush = () => {
    if (paragraph.length) {
      const text = paragraph.join(' ').trim();

      if (openCase) {
        openCase.body.push(text);
      } else {
        // A line opening on a quotation mark is a pull quote, not body copy —
        // which is how the closing line of the ISDS piece is set.
        current.blocks.push({
          kind: text.startsWith('"') ? 'quote' : 'paragraph',
          text,
        });
      }

      paragraph = [];
    }

    if (list.length) {
      current.blocks.push({ kind: 'list', items: list });
      list = [];
    }
  };

  const closeSection = () => {
    flush();
    // The standfirst only counts if something was actually written above the
    // first heading; posts that open on `##` would otherwise get an empty one.
    if (current.heading !== null || current.blocks.length) {
      sections.push(current);
    }
  };

  for (const line of content.split('\n')) {
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }

    if (trimmed.startsWith('## ')) {
      closeSection();
      openCase = null;

      const heading = trimmed.slice(3).trim();
      current = {
        id: slugify(heading),
        heading,
        variant: classify(heading),
        blocks: [],
      };
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flush();

      const text = trimmed.slice(4).trim();
      // `Case 1: The Glass Accident`, or a bare `Case 1`. The separator is
      // loose because the three posts that use this do not agree on it.
      const asCase = text.match(/^Case\s+(\d+)\s*[:.–—-]?\s*(.*)$/i);

      if (asCase) {
        const [, number, title] = asCase;
        const block: Block & { kind: 'case' } = {
          kind: 'case',
          label: `Case ${number}`,
          title: title || undefined,
          body: [],
        };
        current.blocks.push(block);
        openCase = block;
        continue;
      }

      openCase = null;
      current.blocks.push({ kind: 'heading', text });
      continue;
    }

    if (trimmed.startsWith('- ')) {
      // A list interrupts a paragraph, never merges into one. It also ends a
      // case: the cards are narrative, and a bullet list is the article
      // resuming rather than part of the case.
      if (paragraph.length) flush();
      openCase = null;
      list.push(parseListItem(trimmed.slice(2).trim()));
      continue;
    }

    if (list.length) flush();
    paragraph.push(trimmed);
  }

  closeSection();

  // An FAQ is stored as questions rather than blocks, so the renderer can hand
  // it to an accordion instead of printing eight headings in a row.
  return sections.map((section) => {
    if (section.variant !== 'faq') return section;

    const faqs: NonNullable<Section['faqs']> = [];

    for (const block of section.blocks) {
      if (block.kind === 'heading') {
        faqs.push({
          id: slugify(block.text),
          question: block.text,
          answer: [],
        });
      } else if (block.kind === 'paragraph' && faqs.length) {
        faqs[faqs.length - 1].answer.push(block.text);
      }
    }

    // Fall back to prose if the shape was not what the name promised.
    return faqs.length ? { ...section, faqs } : { ...section, variant: 'prose' };
  });
}

/** Headings for the table of contents. The standfirst has none, so it is out. */
export function tableOfContents(sections: Section[]) {
  return sections
    .filter((section) => section.heading)
    .map((section) => ({ id: section.id, label: section.heading as string }));
}
