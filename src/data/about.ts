/**
 * The About page's copy, kept as data rather than markup.
 *
 * Every section on that page is a list of the same shape repeated — five
 * disciplines, four training programmes, four conference highlights, nine
 * research areas, two awards. Holding them here means the page file is layout
 * and motion only, and editing a title never means reading past a ScrollTrigger.
 */

export type Discipline = {
  index: string;
  title: string;
  body: string;
};

export const disciplines: Discipline[] = [
  {
    index: '01',
    title: 'Clinical Dermatology',
    body: 'Advanced diagnosis and management of dermatological and skin conditions.',
  },
  {
    index: '02',
    title: 'Aesthetic Medicine',
    body: 'Evidence-based approaches to facial aesthetics, rejuvenation, injectables, energy-based devices, and minimally invasive procedures.',
  },
  {
    index: '03',
    title: 'Regenerative Medicine',
    body: 'Innovative approaches exploring tissue repair, wound healing, stem-cell-based therapies, nanofat, SVF, and other regenerative strategies.',
  },
  {
    index: '04',
    title: 'Tissue Bioengineering',
    body: 'Exploring the intersection of dermatology, regenerative medicine, biomaterials, and tissue engineering to advance healing and reconstruction.',
  },
  {
    index: '05',
    title: 'Medical Education & Training',
    body: 'Providing educational sessions, workshops, hands-on training, and professional development opportunities for physicians and healthcare professionals.',
  },
];

export type Training = {
  title: string;
  meta?: string;
  body: string;
};

export const training: Training[] = [
  {
    title: 'Everlast Wellness Academy',
    meta: '2026 · Abu Dhabi',
    body: 'Medical training and educational programs covering advanced topics in aesthetic, dermatological, and regenerative medicine.',
  },
  {
    title: 'Women’s Health & Skincare Workshop',
    meta: '2026',
    body: "An educational session addressing women's health and skin care, including early detection, lifestyle, Botox, fillers, PRP, non-surgical facial lifting, treatment safety, and long-term skin health.",
  },
  {
    title: 'Hands-On Laser & Energy-Based Device Training',
    body: 'Practical education focused on laser technology, tissue interaction, energy-based devices, and evidence-based clinical applications.',
  },
  {
    title: 'International Training',
    body: 'Dr. Christeen has also contributed to professional education as an international trainer, sharing advanced clinical techniques and evidence-based approaches with physicians and healthcare professionals.',
  },
];

export type Conference = {
  year: string;
  title: string;
  place?: string;
  body: string;
};

export const conferences: Conference[] = [
  {
    year: '2025',
    title: '44th ISDS Annual Meeting',
    place: 'Abu Dhabi',
    body: 'Presented on the role of early intervention and regenerative medicine in scar management and wound healing.',
  },
  {
    year: '2025',
    title: 'EVSS — Emirates Vascular Surgery Society',
    body: 'Received the Best Abstract Award for an innovative treatment case exploring the use of Stromal Vascular Fraction (SVF) in diabetic foot ulcers.',
  },
  {
    year: '2026',
    title: 'TERMIS-EU',
    body: 'Participated in the scientific program in the field of tissue bioengineering and wound healing, reflecting her expanding contribution to regenerative and tissue-engineering research.',
  },
  {
    year: '2026',
    title: 'EWMA',
    body: 'Presented research on early burn scar management using mesenchymal stem cell therapy, with affiliation to Everlast Wellness Medical Center and Everlast Wellness Academy, Abu Dhabi.',
  },
];

export const researchAreas = [
  'Mesenchymal stem cell-based therapies',
  'Stromal Vascular Fraction (SVF)',
  'Nanofat and regenerative therapies',
  'Burn scar management',
  'Wound healing',
  'Diabetic foot ulcers',
  'Tissue bioengineering',
  'Regenerative dermatology',
  'Advanced aesthetic medicine',
];

export type Award = {
  title: string;
  meta?: string;
  body: string;
};

export const awards: Award[] = [
  {
    title: 'Best Abstract Award',
    meta: 'EVSS 2025',
    body: 'Recognized for an innovative presentation on the use of SVF in the treatment of diabetic foot ulcers, highlighting the potential of regenerative approaches in complex wound care.',
  },
  {
    title: 'International Medical Recognition',
    body: 'Dr. Christeen continues to participate in international scientific, educational, and professional events, contributing to the exchange of knowledge across dermatology, aesthetics, regenerative medicine, and healthcare innovation.',
  },
];

/** The closing row. Three of these lean on the blog, which is where the
 *  conference talks, teaching courses and published research already live —
 *  the hash seeds the index's search box so each lands on its own subset. */
export const aboutLinks = [
  { label: 'Conferences & Events', href: '/blog#conference' },
  { label: 'Training & Workshops', href: '/blog#workshop' },
  { label: 'Research & Publications', href: '/blog#research' },
  { label: 'Book a Consultation', href: '/reach-me' },
];
