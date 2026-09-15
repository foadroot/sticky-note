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
        <span className="text-lg font-semibold text-foreground">FOAD</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm text-muted-foreground">Starter Template</span>
      </div>
    </header>
  );
}
