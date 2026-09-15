"use client";

import { Suspense } from "react";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { usePathname } from "next/navigation";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

const KIND_VARS = {
  success:
    "[--normal-bg:var(--status-green-soft)] [--normal-border:var(--status-green-tint)] [--kind-accent:var(--status-green)]",
  error:
    "[--normal-bg:var(--status-red-soft)] [--normal-border:var(--status-red-tint)] [--kind-accent:var(--status-red)]",
  warning:
    "[--normal-bg:var(--status-yellow-soft)] [--normal-border:var(--status-yellow-tint)] [--kind-accent:var(--status-yellow)]",
  info: "[--normal-bg:var(--status-blue-soft)] [--normal-border:var(--status-blue-tint)] [--kind-accent:var(--status-blue)]",
  loading: "[--kind-accent:var(--primary)]",
} as const;

function PositionedToaster(props: ToasterProps) {
  const hasHeader = usePathname()?.startsWith("/panel") ?? false;

  return (
    <Sonner
      position="top-center"
      offset={{
        top: "1rem",
        right: "1rem",
        bottom: "1rem",
        left: "1rem",
      }}
      mobileOffset={{
        top: hasHeader ? "calc(4rem + 0.5rem)" : "1rem",
        right: "1rem",
        bottom: "1rem",
        left: "1rem",
      }}
      visibleToasts={3}
      closeButton
      theme="light"
      icons={{
        success: <CircleCheck className="size-4 text-status-green" />,
        error: <CircleX className="size-4 text-status-red" />,
        warning: <TriangleAlert className="size-4 text-status-yellow" />,
        info: <Info className="size-4 text-status-blue" />,
        loading: <LoadingSpinner className="size-4 text-primary" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--kind-accent": "var(--border)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: [
            "shadow-[inset_4px_0_0_var(--kind-accent),var(--shadow-figma)]!",
            "text-sm! items-start! gap-3! font-sans",
          ].join(" "),
          title: "font-semibold!",
          description: "text-muted-foreground!",
          icon: "mt-0.5! shrink-0!",
          actionButton:
            "h-7! rounded-md! bg-transparent! px-2! font-semibold! text-[var(--kind-accent)]! hover:bg-foreground/5!",
          cancelButton:
            "h-7! rounded-md! bg-transparent! px-2! font-medium! text-muted-foreground! hover:bg-foreground/5!",
          closeButton:
            "border-border! bg-card! text-muted-foreground! hover:text-foreground!",
          ...KIND_VARS,
        },
      }}
      {...props}
    />
  );
}

function Toaster(props: ToasterProps) {
  return (
    <Suspense fallback={null}>
      <PositionedToaster {...props} />
    </Suspense>
  );
}

export { Toaster };
