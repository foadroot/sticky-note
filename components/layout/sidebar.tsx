"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const SIDEBAR_NAV = [
  {
    label: "Main",
    items: [
      { label: "Workspace", href: "/panel" },
      { label: "Projects", href: "/panel/projects" },
      { label: "Settings", href: "/panel/settings" },
    ],
  },
] as const;

type SidebarItem = {
  label: string;
  href: string;
};

type SidebarSection = {
  label: string;
  items: readonly SidebarItem[];
};

type SidebarProps = {
  sections?: readonly SidebarSection[];
  className?: string;
};

export function Sidebar({ sections = SIDEBAR_NAV, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "scrollbar-none shrink-0 overflow-y-auto border-r border-border bg-sidebar overflow-anchor-none",
        "w-sidebar flex h-full flex-col",
        className,
      )}
    >
      <nav className="flex-1 p-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground-subtle">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
