"use client";

import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";
import type { ComponentType, ErrorInfo, ReactNode } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="mt-3 flex w-full items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-left shadow-xs"
    >
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
      >
        <TriangleAlert className="size-5" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-destructive">
          Something went wrong
        </p>
        <p className="text-sm wrap-break-word text-muted-foreground">
          This section could not be loaded. Try again in a moment.
        </p>

        {error instanceof Error && error.stack ? (
          <details className="mt-1">
            <summary className="w-fit cursor-pointer text-xs font-medium text-muted-foreground underline-offset-4 outline-none hover:underline focus-visible:underline">
              Technical details
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-destructive/20 bg-card p-3 text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {error.message}
              {"\n\n"}
              {error.stack}
            </pre>
          </details>
        ) : null}

        <div className="mt-3">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={resetErrorBoundary}
          >
            <RefreshCw data-icon="inline-start" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  FallbackComponent?: ComponentType<FallbackProps>;
  onError?: (error: unknown, info: ErrorInfo) => void;
  onReset?: (
    details:
      | { reason: "imperative-api"; args: unknown[] }
      | {
          reason: "keys";
          prev: unknown[] | undefined;
          next: unknown[] | undefined;
        },
  ) => void;
  resetKeys?: unknown[];
};

export function ErrorBoundary({
  children,
  fallback,
  FallbackComponent,
  onError,
  onReset,
  resetKeys,
}: ErrorBoundaryProps) {
  const shared = { children, onError, onReset, resetKeys };

  if (fallback !== undefined) {
    return <ReactErrorBoundary fallback={fallback} {...shared} />;
  }

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent ?? DefaultErrorFallback}
      {...shared}
    />
  );
}
