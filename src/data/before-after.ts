import type { StaticImageData } from '@/components/ui/image';

import before01 from '@/assets/before-after/case-01-before.webp';
import after01 from '@/assets/before-after/case-01-after.webp';
import before02 from '@/assets/before-after/case-02-before.webp';
import after02 from '@/assets/before-after/case-02-after.webp';
import before03 from '@/assets/before-after/case-03-before.webp';
import after03 from '@/assets/before-after/case-03-after.webp';
import before04 from '@/assets/before-after/case-04-before.webp';
import after04 from '@/assets/before-after/case-04-after.webp';
import before05 from '@/assets/before-after/case-05-before.webp';
import after05 from '@/assets/before-after/case-05-after.webp';
import before06 from '@/assets/before-after/case-06-before.webp';
import after06 from '@/assets/before-after/case-06-after.webp';
import before07 from '@/assets/before-after/case-07-before.webp';
import after07 from '@/assets/before-after/case-07-after.webp';
import before08 from '@/assets/before-after/case-08-before.webp';
import after08 from '@/assets/before-after/case-08-after.webp';
import before09 from '@/assets/before-after/case-09-before.webp';
import after09 from '@/assets/before-after/case-09-after.webp';
import before10 from '@/assets/before-after/case-10-before.webp';
import after10 from '@/assets/before-after/case-10-after.webp';
import before11 from '@/assets/before-after/case-11-before.webp';
import after11 from '@/assets/before-after/case-11-after.webp';
import before12 from '@/assets/before-after/case-12-before.webp';
import after12 from '@/assets/before-after/case-12-after.webp';

export type BeforeAfterCase = {
  id: string;
  before: StaticImageData;
  after: StaticImageData;
  /** The treatment, as the clinic names it. 'TODO' until confirmed. */
  treatment: string;
  /** Filter group on the Before & After page. 'Uncategorized' until confirmed. */
  category: string;
  sessions?: number;
  /** object-position for both images, so the area treated lines up. */
  objectPosition?: string;
};

/** Placeholder values — a case carrying them has not been labelled yet. */
export const UNKNOWN_TREATMENT = 'TODO';
export const UNCATEGORIZED = 'Uncategorized';

/**
 * What a case is called on screen: its treatment once the clinic has supplied
 * it, otherwise its number (`Case 01`) — never the placeholder.
 */
export function caseTitle(item: BeforeAfterCase) {
  if (item.treatment !== UNKNOWN_TREATMENT) return item.treatment;
  return `Case ${item.id.replace('case-', '')}`;
}

/**
 * Split out of the delivered composites in `src/assets/before & after/`, where
 * each file held the two states side by side with a cream separator between
 * them. A wipe needs two independent layers, so each one was cut at its own
 * gutter — the seam is not at 50% in every file — and the wider half was
 * centre-cropped to match the narrower rather than squeezed, so nothing being
 * compared is distorted. The originals are untouched.
 *
 * TODO(labels): only the clinic knows what each case treated. Nothing here
 * should be guessed at: a wrong treatment name on a patient result is a
 * clinical claim, not a caption. Fill in `treatment` and `category` (and
 * `sessions` where known) and the page picks them up.
 */
export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: 'case-01',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before01,
    after: after01,
  },
  {
    id: 'case-02',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before02,
    after: after02,
  },
  {
    id: 'case-03',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before03,
    after: after03,
  },
  {
    id: 'case-04',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before04,
    after: after04,
  },
  {
    id: 'case-05',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before05,
    after: after05,
  },
  {
    id: 'case-06',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before06,
    after: after06,
  },
  {
    id: 'case-07',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before07,
    after: after07,
  },
  {
    id: 'case-08',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before08,
    after: after08,
  },
  {
    id: 'case-09',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before09,
    after: after09,
  },
  {
    id: 'case-10',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before10,
    after: after10,
  },
  {
    id: 'case-11',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before11,
    after: after11,
  },
  {
    id: 'case-12',
    treatment: UNKNOWN_TREATMENT,
    category: UNCATEGORIZED,
    before: before12,
    after: after12,
  },
];
