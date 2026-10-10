import { EDU_PLACE_LABEL, type EduPlace } from '@/components/education/EduProgramData';

const TONE: Record<EduPlace, string> = {
  india: 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  abroad: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
};

/**
 * "India" / "Abroad" availability tag. The tag only carries the place name — wherever tags are listed,
 * the surrounding markup gives the context (an sr-only "Available in:" or a visible label).
 */
export function EduPlaceTag({ where }: { where: EduPlace }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${TONE[where]}`}
    >
      {EDU_PLACE_LABEL[where]}
    </span>
  );
}
