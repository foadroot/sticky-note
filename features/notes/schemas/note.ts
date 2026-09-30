import { z } from "zod";
export const noteSchema = z.object({ content: z.string().trim().min(1, "Write a thought first.").max(10_000), projectId: z.string().cuid().nullable().optional(), expirationDays: z.union([z.literal(1), z.literal(3), z.literal(7), z.literal(14), z.literal(30), z.null()]).optional() });
export const projectSchema = z.object({ name: z.string().trim().min(1).max(120), description: z.string().trim().max(500).optional() });
