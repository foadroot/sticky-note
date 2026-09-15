import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

const PageHeader = ({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "flex flex-col gap-2",
        actions && "sm:flex-row sm:items-start sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="text-[13px] text-muted-foreground-subtle">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
};

export default PageHeader;
