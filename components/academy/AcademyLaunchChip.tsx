/** Small amber status chip: the Academy (and each course area) is launching soon. Server component. */
export function AcademyLaunchChip({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 ${className}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Launching soon
    </span>
  );
}
