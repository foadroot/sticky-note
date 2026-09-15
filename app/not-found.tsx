import Link from "next/link";
import { MoveLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-background px-6 py-20">
      <p
        aria-hidden
        className="text-[8rem] font-bold leading-none text-foreground/5 sm:text-[10rem] lg:text-[13rem]"
      >
        404
      </p>

      <p className="mt-2 text-xs font-bold tracking-[0.18em] text-muted-foreground-subtle uppercase">
        Page Not Found
      </p>

      <h1 className="mt-3 text-3xl font-bold text-foreground">
        Lost in the void
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>

      <div className="mt-9">
        <Link
          href="/"
          className={cn(
            buttonVariants(),
            "h-12 px-6 text-base font-semibold",
          )}
        >
          <MoveLeft data-icon="inline-start" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
