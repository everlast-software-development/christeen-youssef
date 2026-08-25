import type { StaticImageData } from 'next/image';

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
  label: string;
  before: StaticImageData;
  after: StaticImageData;
};

/**
 * Split out of the delivered composites in `src/assets/before & after/`, where
 * each file held the two states side by side with a cream separator between
 * them. A wipe needs two independent layers, so each one was cut at its own
 * gutter — the seam is not at 50% in every file — and the wider half was
 * centre-cropped to match the narrower rather than squeezed, so nothing being
 * compared is distorted. The originals are untouched.
 *
 * TODO(labels): these read `Case 01`…`Case 12` because only the clinic knows
 * what each one treated. Nothing here should be guessed at: a wrong treatment
 * name on a patient result is a clinical claim, not a caption. Replace `label`
 * with the real treatment and the cards pick it up.
 */
export const beforeAfterCases: BeforeAfterCase[] = [
  {
    id: 'case-01',
    label: 'Case 01',
    before: before01,
    after: after01,
  },
  {
    id: 'case-02',
    label: 'Case 02',
    before: before02,
    after: after02,
  },
  {
    id: 'case-03',
    label: 'Case 03',
    before: before03,
    after: after03,
  },
  {
    id: 'case-04',
    label: 'Case 04',
    before: before04,
    after: after04,
  },
  {
    id: 'case-05',
    label: 'Case 05',
    before: before05,
    after: after05,
  },
  {
    id: 'case-06',
    label: 'Case 06',
    before: before06,
    after: after06,
  },
  {
    id: 'case-07',
    label: 'Case 07',
    before: before07,
    after: after07,
  },
  {
    id: 'case-08',
    label: 'Case 08',
    before: before08,
    after: after08,
  },
  {
    id: 'case-09',
    label: 'Case 09',
    before: before09,
    after: after09,
  },
  {
    id: 'case-10',
    label: 'Case 10',
    before: before10,
    after: after10,
  },
  {
    id: 'case-11',
    label: 'Case 11',
    before: before11,
    after: after11,
  },
  {
    id: 'case-12',
    label: 'Case 12',
    before: before12,
    after: after12,
  },
];
