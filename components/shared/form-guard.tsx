"use client";

import { useEffect } from "react";

export function FormGuardProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let openCount = 0;

    function hasOpenModal(): boolean {
      return openCount > 0;
    }

    function recount() {
      const portals = document.querySelectorAll("[data-radix-portal]");
      let count = 0;
      for (const portal of portals) {
        if (portal.querySelector('[role="dialog"]')) count++;
      }
      openCount = count;
    }

    const observer = new MutationObserver(recount);
    observer.observe(document.body, { childList: true, subtree: true });
    recount();

    function handleKeydown(event: KeyboardEvent) {
      if (event.key !== "Enter") return;
      if (!hasOpenModal()) return;

      const target = event.target as HTMLElement;
      if (!target) return;

      const tag = target.tagName;
      const isInput =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable;
      if (!isInput) return;

      const form = target.closest("form");
      if (!form) return;

      event.preventDefault();

      (globalThis as Record<string, unknown>).__formGuardTrustedSubmit = true;
      try {
        form.requestSubmit();
      } finally {
        (globalThis as Record<string, unknown>).__formGuardTrustedSubmit =
          false;
      }
    }

    document.addEventListener("keydown", handleKeydown, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", handleKeydown, true);
    };
  }, []);

  return <>{children}</>;
}
