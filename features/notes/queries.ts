import "server-only";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
export async function dashboardData(search = "", archived = false) {
  const user = await requireUser(); const now = new Date();
  const projects = await db.project.findMany({ where: { userId: user.id, status: "ACTIVE" }, orderBy: { updatedAt: "desc" } });
  const notes = await db.stickyNote.findMany({ where: { userId: user.id, deletedAt: null, status: archived ? "ARCHIVED" : "ACTIVE", ...(archived ? {} : { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }), ...(search ? { content: { contains: search, mode: "insensitive" } } : {}) }, include: { project: { select: { name: true } } }, orderBy: { updatedAt: "desc" }, take: 100 });
  const settings = await db.userSettings.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
  return { projects, notes, settings };
}
export async function projectData(id: string, archived = false) { const user = await requireUser(); const project = await db.project.findFirst({ where: { id, userId: user.id } }); if (!project) return null; const notes = await db.stickyNote.findMany({ where: { projectId: id, userId: user.id, deletedAt: null, status: archived ? "ARCHIVED" : "ACTIVE", ...(archived ? {} : { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }) }, orderBy: { updatedAt: "desc" } }); return { project, notes }; }
