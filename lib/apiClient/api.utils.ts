import type {
  ApiResponse,
  FormDataInput,
  PaginationMeta,
  QueryParams,
  RequestBody,
} from "./api.types";

export function buildQueryString(params?: QueryParams): string {
  if (!params) return "";

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === null || item === undefined) continue;
        search.append(key, String(item));
      }
      continue;
    }

    search.append(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

export function resolveUrl(
  baseUrl: string,
  path: string,
  params?: QueryParams,
): string {
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute
    ? path
    : `${baseUrl.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  const query = buildQueryString(params);
  if (!query) return url;

  return url.includes("?") ? `${url}&${query.slice(1)}` : `${url}${query}`;
}

export function isJsonSerializable(body: RequestBody): boolean {
  if (body === null || typeof body !== "object") return false;

  return !(
    isFormData(body) ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
  );
}

export function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function appendFormValue(form: FormData, key: string, value: unknown): void {
  if (value === null || value === undefined) return;

  if (value instanceof Blob) {
    form.append(key, value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) appendFormValue(form, key, item);
    return;
  }

  if (value instanceof Date) {
    form.append(key, value.toISOString());
    return;
  }

  if (typeof value === "object") {
    form.append(key, JSON.stringify(value));
    return;
  }

  form.append(key, String(value));
}

export function toFormData(input: FormDataInput): FormData {
  if (isFormData(input)) return input;

  const form = new FormData();
  for (const [key, value] of Object.entries(input)) {
    appendFormValue(form, key, value);
  }

  return form;
}

export async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return null;

  const text = await response.text();
  if (text.length === 0) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) return text;

  return JSON.parse(text) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function isEnvelope(
  value: unknown,
): value is Record<string, unknown> & { data: unknown } {
  return isRecord(value) && "data" in value;
}

export function toApiResponse<TData>(
  payload: unknown,
  response: Response,
): ApiResponse<TData> {
  if (isEnvelope(payload)) {
    return {
      success:
        typeof payload.success === "boolean" ? payload.success : response.ok,
      statusCode:
        typeof payload.statusCode === "number"
          ? payload.statusCode
          : response.status,
      message:
        typeof payload.message === "string"
          ? payload.message
          : response.statusText,
      data: payload.data as TData,
    };
  }

  return {
    success: response.ok,
    statusCode: response.status,
    message: response.statusText,
    data: payload as TData,
  };
}

export function extractList(payload: unknown): {
  items: unknown;
  meta: Record<string, unknown>;
} {
  const envelope = isEnvelope(payload) ? payload : null;
  const inner = envelope ? envelope.data : payload;

  const container = isRecord(inner) ? inner : null;
  const nested =
    container?.items ??
    container?.results ??
    container?.rows ??
    container?.data;

  const items = Array.isArray(inner) ? inner : (nested ?? inner);

  const meta =
    asRecord(envelope?.meta) ??
    asRecord(envelope?.pagination) ??
    asRecord(container?.meta) ??
    asRecord(container?.pagination) ??
    container ??
    envelope ??
    {};

  return { items, meta };
}

function toNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed)
    ? parsed
    : fallback;
}

export function toPaginationMeta(
  source: Record<string, unknown>,
  itemCount: number,
): PaginationMeta {
  const page = toNumber(source.page ?? source.currentPage, 1);
  const limit = toNumber(
    source.limit ?? source.perPage ?? source.pageSize,
    itemCount,
  );
  const total = toNumber(
    source.total ?? source.totalItems ?? source.count,
    itemCount,
  );
  const totalPages = toNumber(
    source.totalPages ?? source.pageCount,
    limit > 0 ? Math.ceil(total / limit) : 1,
  );

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage:
      typeof source.hasNextPage === "boolean"
        ? source.hasNextPage
        : page < totalPages,
    hasPreviousPage:
      typeof source.hasPreviousPage === "boolean"
        ? source.hasPreviousPage
        : typeof source.hasPrevPage === "boolean"
          ? source.hasPrevPage
          : page > 1,
  };
}

export function extractErrorMessage(
  payload: unknown,
  response: Response,
): string {
  const fallback = `Request failed with status ${response.status}${
    response.statusText ? ` ${response.statusText}` : ""
  }`;

  if (typeof payload === "string" && payload.trim().length > 0) return payload;
  if (!isRecord(payload)) return fallback;

  const candidate = payload.message ?? payload.error ?? payload.detail;

  if (typeof candidate === "string" && candidate.length > 0) return candidate;
  if (Array.isArray(candidate) && typeof candidate[0] === "string") {
    return candidate.join(", ");
  }

  return fallback;
}
