"use client";

import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { archiveNote, deleteNote, restoreNote } from "../actions";
import { toast } from "@/lib/toast";

type Note = { id: string; content: string; expiresAt: Date | null; project?: { name: string } | null };
const noteColors = ["#fff2aa", "#ffe0bd", "#dff2d8", "#dce9ff", "#eee1ff"];

export function NotesList({ notes, archived = false }: { notes: Note[]; archived?: boolean }) {
  if (!notes.length) return <div className="rounded-[1.75rem] border border-dashed border-border bg-card p-14 text-center"><p className="text-lg font-medium text-foreground">{archived ? "No notes are resting here." : "Your desk is clear."}</p><p className="mt-2 text-sm text-muted-foreground">{archived ? "Archived notes will always remain available." : "Capture a thought when something worth keeping appears."}</p></div>;
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{notes.map((note, index) => <article key={note.id} style={{ backgroundColor: noteColors[index % noteColors.length] }} className="group flex min-h-52 flex-col rounded-[1.45rem] p-5 shadow-[0_12px_24px_rgba(41,39,25,.10)] transition duration-200 hover:-translate-y-1 hover:rotate-[.25deg] hover:shadow-[0_18px_30px_rgba(41,39,25,.16)]"><p className="whitespace-pre-wrap text-[15px] leading-7 text-[#273142]">{note.content}</p><footer className="mt-auto flex items-end justify-between gap-3 border-t border-[#273142]/10 pt-4 text-xs text-[#273142]/65"><span className="leading-5">{note.project?.name ?? "Inbox"}<br/>{note.expiresAt ? `Expires ${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(note.expiresAt))}` : "Stays until you archive it"}</span><div className="flex gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"><button aria-label={archived ? "Restore note" : "Archive note"} onClick={() => void onArchive(note.id, archived)} className="rounded-md p-1.5 hover:bg-white/50">{archived ? <RotateCcw className="size-3.5"/> : <Archive className="size-3.5"/>}</button><button aria-label="Delete note" onClick={() => void onDelete(note.id)} className="rounded-md p-1.5 text-destructive hover:bg-white/50"><Trash2 className="size-3.5"/></button></div></footer></article>)}</div>;
}
async function onArchive(id: string, archived: boolean) { try { if (archived) { await restoreNote(id); toast.success("Note restored."); } else { await archiveNote(id); toast.success("Note archived.", { action: { label: "Undo", onClick: () => void restoreNote(id) } }); } } catch (error) { toast.fromError(error); } }
async function onDelete(id: string) { try { await deleteNote(id); toast.success("Note deleted."); } catch (error) { toast.fromError(error); } }
