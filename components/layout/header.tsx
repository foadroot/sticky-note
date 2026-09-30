import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex w-full items-center justify-between gap-2.5 border-b border-border bg-card sm:gap-4",
        "sticky top-0 z-40",
        "h-16 px-4 py-3 sm:h-header sm:px-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"><span className="grid size-7 place-items-center rounded-md bg-primary text-sm text-primary-foreground">✦</span>sticky</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:inline">Ctrl/Cmd + Shift + Space</span>
      </div>
    </header>
  );
}
