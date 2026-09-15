import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

function LoadingSpinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2>) {
  return (
    <Loader2
      data-slot="loading-spinner"
      className={cn("size-4 animate-spin text-muted-foreground", className)}
      {...props}
    />
  );
}

export { LoadingSpinner };
