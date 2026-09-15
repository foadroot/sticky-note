export const ROLE = {
  SUPER_ADMIN: "super-admin",
  MANAGER: "manager",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
