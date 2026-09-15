import type { ApiErrorLike, HttpMethod } from "./api.types";

export const API_ERROR_CODE = {
  HTTP: "HTTP_ERROR",
  NETWORK: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  ABORTED: "ABORTED",
  PARSE: "PARSE_ERROR",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

interface ApiErrorInit<TBody> {
  message: string;
  status: number;
  url: string;
  method: HttpMethod;
  code?: ApiErrorCode;
  statusText?: string;
  body?: TBody | null;
  cause?: unknown;
}

export class ApiError<TBody = unknown> extends Error implements ApiErrorLike {
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly method: HttpMethod;
  readonly code: ApiErrorCode;
  readonly body: TBody | null;

  constructor(init: ApiErrorInit<TBody>) {
    super(
      init.message,
      init.cause === undefined ? undefined : { cause: init.cause },
    );
    this.name = "ApiError";
    this.status = init.status;
    this.statusText = init.statusText ?? "";
    this.url = init.url;
    this.method = init.method;
    this.code = init.code ?? API_ERROR_CODE.HTTP;
    this.body = init.body ?? null;
  }

  static is<TBody = unknown>(error: unknown): error is ApiError<TBody> {
    return error instanceof ApiError;
  }

  get isTransportError(): boolean {
    return this.status === 0;
  }

  get isTimeout(): boolean {
    return this.code === API_ERROR_CODE.TIMEOUT;
  }

  get isAborted(): boolean {
    return this.code === API_ERROR_CODE.ABORTED;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidationError(): boolean {
    return this.status === 400 || this.status === 422;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}
