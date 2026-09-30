"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, hashPassword, verifyPassword } from "@/lib/auth";
const value = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
export async function signIn(formData: FormData) { const email = value(formData, "email").toLowerCase(); const password = value(formData, "password"); const user = await db.user.findUnique({ where: { email } }); if (!user || !verifyPassword(password, user.passwordHash)) redirect("/login?error=invalid"); await createSession(user.id); redirect("/panel"); }
export async function signUp(formData: FormData) { const email = value(formData, "email").toLowerCase(); const name = value(formData, "name"); const password = value(formData, "password"); if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) redirect("/login?error=validation"); const exists = await db.user.findUnique({ where: { email } }); if (exists) redirect("/login?error=exists"); const user = await db.user.create({ data: { email, name: name || null, passwordHash: hashPassword(password), settings: { create: {} } } }); await createSession(user.id); redirect("/panel"); }
