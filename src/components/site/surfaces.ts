/**
 * Surfaces shared between the home page and the pages built in its image.
 *
 * GLASS_PANEL — the frosted panel of the home page's Patient Stories.
 * CARD — the Built on Trust card; pair it with a tone from CARD_TONE: `cream`
 * on page-coloured sections, `page` on cream ones (never white).
 */
export const GLASS_PANEL =
  'rounded-[16px] border border-white/14 bg-[linear-gradient(160deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))] backdrop-blur-[16px]';

export const CARD = 'flex flex-col gap-2 rounded-[16px] p-6';

export const CARD_TONE = {
  cream: 'border border-line bg-cream text-text',
  page: 'border border-line bg-page text-text',
  // Gold surfaces carry white type on gold-deep (4.5:1).
  gold: 'bg-gold-deep text-white',
} as const;
