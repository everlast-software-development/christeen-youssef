import { cn } from '@/lib/utils';

export type NumberedRow = { index: string; title: string; body: string };

/**
 * The numbered hairline list from the home page's About section: rows on ink,
 * a gold-light number, the title and a one-line statement beneath it.
 */
export function NumberedRows({
  items,
  className,
}: {
  items: NumberedRow[];
  className?: string;
}) {
  return (
    <ol className={cn('m-0 flex list-none flex-col border-t border-white/12 p-0', className)}>
      {items.map((item) => (
        <li
          key={item.index}
          className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-white/12 py-3.5"
        >
          <span className="pt-[3px] text-[12.5px] font-semibold text-gold-light">{item.index}</span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[15.5px] font-semibold">{item.title}</span>
            <span className="text-[13.5px] text-[#9E978B]">{item.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
