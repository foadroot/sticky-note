import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { requireUser } from "@/lib/auth";
import { QuickCapture } from "@/features/notes/components/quick-capture";
import { db } from "@/lib/db";
export default async function PanelLayout({ children }: { children: ReactNode }) { const user = await requireUser(); const [projects, settings] = await Promise.all([db.project.findMany({ where: { userId: user.id, status: "ACTIVE" }, select: { id: true, name: true } }), db.userSettings.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } })]); return <div className="flex h-screen flex-col overflow-hidden bg-background"><Header /><div className="flex min-h-0 flex-1"><Sidebar className="hidden lg:flex" /><main className="flex-1 overflow-y-auto p-5 sm:p-8">{children}</main></div><div className="fixed bottom-5 right-5"><QuickCapture projects={projects} defaultExpirationDays={settings.defaultExpirationDays} /></div></div>; }
