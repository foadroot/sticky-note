export const routes = {
  publicRoutes: {
    home: "/",
  },
  privateRoutes: {
    admin: {
      dashboard: "/panel/admin/dashboard",
    },
    employee: {
      dashboard: "/panel/employee/dashboard",
    },
  },
} as const;

import { type Role } from "./roles";

export function panelHomeFor(role: Role): string | null {
  switch (role) {
    case "super-admin":
    case "manager":
      return routes.privateRoutes.admin.dashboard;
    case "employee":
      return routes.privateRoutes.employee.dashboard;
    default:
      return null;
  }
}
