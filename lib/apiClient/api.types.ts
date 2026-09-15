export interface ApiResponse<TData = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: TData;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<TItem = unknown> extends ApiResponse<
  TItem[]
> {
  meta: PaginationMeta;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ReadonlyArray<string | number | boolean>;

export type QueryParams = Record<string, QueryParamValue>;

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: QueryParamValue;
}

export type RequestBody = BodyInit | Record<string, unknown> | unknown[] | null;

export type FormDataInput = FormData | Record<string, unknown>;

export interface RequestConfig extends Omit<RequestInit, "method" | "body"> {
  params?: QueryParams;
  timeout?: number;
  token?: string | null;
  skipAuth?: boolean;
  skipUnauthorizedHandler?: boolean;
  baseUrl?: string;
  dedupe?: boolean;
}

export type RequestOptions = Omit<RequestConfig, "params"> & {
  params?: QueryParams;
};

export type TokenResolver = () =>
  string | null | undefined | Promise<string | null | undefined>;

export interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
  credentials?: RequestCredentials;
  authScheme?: string;
  tokenResolver?: TokenResolver;
  onUnauthorized?: (error: ApiErrorLike) => void | Promise<void>;
}

export interface ApiErrorLike extends Error {
  status: number;
  url: string;
  body: unknown;
}
