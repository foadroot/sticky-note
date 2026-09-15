"use client";

import type { ReactNode } from "react";
import { toast as sonner } from "sonner";

import { ApiError } from "@/lib/apiClient";

export type ToastKind = "success" | "error" | "warning" | "info";

type ToastType = ToastKind | "message" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  duration?: number;
  action?: ToastAction;
  cancel?: ToastAction;
  position?: ToastPosition;
}

export interface ToastCustomOptions extends ToastOptions {
  title: ReactNode;
  kind?: ToastKind | "message" | "loading";
}

export interface ToastPromiseOptions<T> {
  loading: string;
  success: string | ((value: T) => string);
  error: string | ((error: unknown) => string);
}

const DURATION: Record<ToastType, number> = {
  success: 4000,
  info: 5000,
  message: 5000,
  warning: 6000,
  error: 8000,
  loading: 0,
};

function toDuration(type: ToastType, duration: number | undefined): number {
  const resolved = duration ?? DURATION[type];
  return resolved === 0 ? Infinity : resolved;
}

function toOptions(type: ToastType, options: ToastOptions) {
  return {
    id: options.id,
    description: options.description,
    duration: toDuration(type, options.duration),
    action: options.action
      ? { label: options.action.label, onClick: options.action.onClick }
      : undefined,
    cancel: options.cancel
      ? { label: options.cancel.label, onClick: options.cancel.onClick }
      : undefined,
    position: options.position,
  };
}

function queue(
  type: ToastType,
  title: ReactNode,
  options: ToastOptions = {},
): string | number {
  const resolved = toOptions(type, options);

  switch (type) {
    case "success":
      return sonner.success(title, resolved);
    case "error":
      return sonner.error(title, resolved);
    case "warning":
      return sonner.warning(title, resolved);
    case "info":
      return sonner.info(title, resolved);
    case "loading":
      return sonner.loading(title, resolved);
    case "message":
      return sonner.message(title, resolved);
  }
}

interface ErrorCopy {
  title: string;
  description?: string;
}

const GENERIC_ERROR: ErrorCopy = {
  title: "Something went wrong",
  description: "Please try again.",
};

function serverMessage(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;

  const { message, error } = body as { message?: unknown; error?: unknown };

  if (typeof message === "string" && message.trim() !== "") return message;
  if (typeof error === "string" && error.trim() !== "") return error;
  return undefined;
}

function errorCopy(error: unknown): ErrorCopy {
  if (ApiError.is(error)) {
    if (error.isAborted) return { title: "Request cancelled" };
    if (error.isTimeout || error.isTransportError)
      return {
        title: "Can't reach the server",
        description: "Check your connection and try again.",
      };
    if (error.isUnauthorized)
      return {
        title: "Session expired",
        description: "Sign in again to continue.",
      };
    if (error.isForbidden)
      return { title: "You don't have permission to do that." };
    if (error.isNotFound) return { title: "Not found." };
    if (error.isValidationError) {
      const message = serverMessage(error.body);
      return {
        title: "Check your input",
        description: message ?? "Some values were rejected.",
      };
    }
    if (error.isServerError)
      return {
        title: "Something went wrong on our end.",
        description: "Please try again in a moment.",
      };

    const message = serverMessage(error.body);
    return message ? { title: message } : GENERIC_ERROR;
  }

  if (error instanceof Error && error.message.trim() !== "")
    return { title: error.message };

  if (typeof error === "string" && error.trim() !== "")
    return { title: error };

  return GENERIC_ERROR;
}

export const toast = {
  success: (title: ReactNode, options?: ToastOptions) =>
    queue("success", title, options),

  error: (title: ReactNode, options?: ToastOptions) =>
    queue("error", title, options),

  warning: (title: ReactNode, options?: ToastOptions) =>
    queue("warning", title, options),

  info: (title: ReactNode, options?: ToastOptions) =>
    queue("info", title, options),

  message: (title: ReactNode, options?: ToastOptions) =>
    queue("message", title, options),

  loading: (title: ReactNode, options?: ToastOptions) =>
    queue("loading", title, options),

  promise: <T>(
    promise: Promise<T>,
    options: ToastPromiseOptions<T>,
  ): Promise<T> => {
    sonner.promise(promise, {
      loading: options.loading,
      success: (value: T) => ({
        message:
          typeof options.success === "function"
            ? options.success(value)
            : options.success,
        duration: DURATION.success,
      }),
      error: (error: unknown) => ({
        message:
          typeof options.error === "function"
            ? options.error(error)
            : options.error,
        duration: DURATION.error,
      }),
    });

    return promise;
  },

  dismiss: (id?: string | number) => {
    sonner.dismiss(id);
  },

  update: (id: string | number, options: ToastCustomOptions) => {
    const { title, kind, ...rest } = options;
    return queue(kind ?? "message", title, { ...rest, id });
  },

  custom: ({ title, kind, ...options }: ToastCustomOptions) =>
    queue(kind ?? "message", title, options),

  fromError: (
    error: unknown,
    options: ToastOptions & { title?: ReactNode } = {},
  ) => {
    const { title, description, ...rest } = options;
    const copy = errorCopy(error);

    return queue("error", title ?? copy.title, {
      ...rest,
      description: description ?? copy.description,
    });
  },
};
