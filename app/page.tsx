import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FOAD Starter",
  description:
    "A Next.js starter template with the folder structure and patterns you love.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-background">
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <span className="text-lg font-bold text-foreground">FOAD Starter</span>
        <div className="flex items-center gap-4">
          <Link
            href="/panel/admin/dashboard"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase mb-3">
            Starter Template
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Build with{" "}
            <span className="text-primary">FOAD</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            A Next.js starter template with the folder structure, patterns, and
            utilities from pos-frontend. Ready for your next project.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/panel/admin/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-20 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground">Feature Modules</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Organized features with barrel exports, actions, queries, and schemas.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground">API Client</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Typed fetch wrapper with singleton pattern, auth, and pagination.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground">UI Components</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              shadcn/ui base-nova style with CVA variants and Tailwind tokens.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card px-6 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          FOAD Starter Template &mdash; Built with Next.js, React, Tailwind CSS, and shadcn/ui.
        </p>
      </footer>
    </div>
  );
}
