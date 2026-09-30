"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { expiresAtFor } from "./lib/expiration";
import { noteSchema, projectSchema } from "./schemas/note";

const refresh = () => { revalidatePath("/panel"); revalidatePath("/panel/projects", "layout"); };
export async function createProject(input: unknown) {
  const user = await requireUser(); const raw = input instanceof FormData ? { name: input.get("name"), description: input.get("description") } : input; const data = projectSchema.parse(raw);
  await db.project.create({ data: { ...data, description: data.description || null, userId: user.id } }); refresh();
}
export async function createNote(input: unknown) {
  const user = await requireUser(); const data = noteSchema.parse(input);
  if (data.projectId && !(await db.project.findFirst({ where: { id: data.projectId, userId: user.id, status: "ACTIVE" } }))) throw new Error("Project not found.");
  const settings = await db.userSettings.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
  const days = data.expirationDays === undefined ? settings.defaultExpirationDays : data.expirationDays;
  const note = await db.stickyNote.create({ data: { content: data.content, userId: user.id, projectId: data.projectId ?? null, expiresAt: expiresAtFor(days) } }); refresh(); return note;
}
export async function archiveNote(id: string) { const user = await requireUser(); await db.stickyNote.updateMany({ where: { id, userId: user.id, deletedAt: null }, data: { status: "ARCHIVED", archivedAt: new Date() } }); refresh(); }
export async function restoreNote(id: string) { const user = await requireUser(); await db.stickyNote.updateMany({ where: { id, userId: user.id, deletedAt: null }, data: { status: "ACTIVE", archivedAt: null } }); refresh(); }
export async function deleteNote(id: string) { const user = await requireUser(); await db.stickyNote.updateMany({ where: { id, userId: user.id, deletedAt: null }, data: { deletedAt: new Date() } }); refresh(); }
export async function updateNote(id: string, input: unknown) { const user = await requireUser(); const data = noteSchema.parse(input); if (data.projectId && !(await db.project.findFirst({ where: { id: data.projectId, userId: user.id } }))) throw new Error("Project not found."); await db.stickyNote.updateMany({ where: { id, userId: user.id, deletedAt: null }, data: { content: data.content, projectId: data.projectId ?? null, expiresAt: data.expirationDays === undefined ? undefined : expiresAtFor(data.expirationDays) } }); refresh(); }
export async function updateSettings(expirationDays: number | null) { const user = await requireUser(); if (expirationDays !== null && ![1, 3, 7, 14, 30].includes(expirationDays)) throw new Error("Invalid expiration period."); await db.userSettings.upsert({ where: { userId: user.id }, update: { defaultExpirationDays: expirationDays }, create: { userId: user.id, defaultExpirationDays: expirationDays } }); refresh(); }
