"use client";

import { archiveNote, deleteNote, restoreNote } from "../actions";
import { toast } from "@/lib/toast";

type Note = { id: string; content: string; expiresAt: Date | null; project?: { name: string } | null };

export function NotesList({ notes, archived = false }: { notes: Note[]; archived?: boolean }) {
  if (!notes.length) return <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-sm text-muted-foreground">{archived ? "No archived notes yet." : "Nothing captured yet. Capture the thought before it escapes."}</div>;
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{notes.map((note) => <article key={note.id} className="group flex min-h-44 flex-col rounded-2xl border border-[#35453a] bg-[#1b241f] p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#b8f582]/70 hover:shadow-lg"><p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{note.content}</p><footer className="mt-auto flex items-end justify-between gap-3 border-t border-white/8 pt-4 text-xs text-muted-foreground"><span className="leading-5">{note.project?.name ?? "Inbox"}<br/>{note.expiresAt ? `Expires ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(note.expiresAt))}` : "No expiration"}</span><div className="flex gap-3 opacity-70 transition group-hover:opacity-100"><button onClick={() => void onArchive(note.id, archived)} className="hover:text-primary">{archived ? "Restore" : "Archive"}</button><button onClick={() => void onDelete(note.id)} className="text-destructive hover:underline">Delete</button></div></footer></article>)}</div>;
}

async function onArchive(id: string, archived: boolean) { try { if (archived) { await restoreNote(id); toast.success("Note restored."); } else { await archiveNote(id); toast.success("Note archived.", { action: { label: "Undo", onClick: () => void restoreNote(id) } }); } } catch (error) { toast.fromError(error); } }
async function onDelete(id: string) { try { await deleteNote(id); toast.success("Note deleted."); } catch (error) { toast.fromError(error); } }
