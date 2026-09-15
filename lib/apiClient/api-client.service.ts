import { API_ERROR_CODE, ApiError } from "./api.error";
import type {
  ApiClientConfig,
  ApiResponse,
  FormDataInput,
  HttpMethod,
  PaginatedResponse,
  PaginationParams,
  RequestBody,
  RequestConfig,
  TokenResolver,
} from "./api.types";
import {
  extractErrorMessage,
  extractList,
  isFormData,
  isJsonSerializable,
  parseResponseBody,
  resolveUrl,
  toApiResponse,
  toFormData,
  toPaginationMeta,
} from "./api.utils";

export class ApiClient {
  private static instance: ApiClient | null = null;

  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private authScheme: string;
  private timeout?: number;
  private credentials?: RequestCredentials;
  private tokenResolver?: TokenResolver;
  private onUnauthorized?: ApiClientConfig["onUnauthorized"];
  private token: string | null = null;

  private constructor(config: ApiClientConfig = {}) {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    this.defaultHeaders = { Accept: "application/json" };
    this.authScheme = "Bearer";
    this.configure(config);
  }

  static getInstance(config?: ApiClientConfig): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(config);
      return ApiClient.instance;
    }

    if (config) ApiClient.instance.configure(config);
    return ApiClient.instance;
  }

  static reset(): void {
    ApiClient.instance = null;
  }

  configure(config: ApiClientConfig): this {
    if (config.baseUrl !== undefined) this.baseUrl = config.baseUrl;
    if (config.headers) {
      this.defaultHeaders = { ...this.defaultHeaders, ...config.headers };
    }
    if (config.timeout !== undefined) this.timeout = config.timeout;
    if (config.credentials !== undefined) this.credentials = config.credentials;
    if (config.authScheme !== undefined) this.authScheme = config.authScheme;
    if (config.tokenResolver !== undefined)
      this.tokenResolver = config.tokenResolver;
    if (config.onUnauthorized !== undefined)
      this.onUnauthorized = config.onUnauthorized;

    return this;
  }

  setToken(token: string | null): this {
    this.token = token;
    return this;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): this {
    this.token = null;
    return this;
  }

  setTokenResolver(resolver: TokenResolver | null): this {
    this.tokenResolver = resolver ?? undefined;
    return this;
  }

  get<TData = unknown>(
    path: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<TData>> {
    return this.request<TData>("GET", path, undefined, config);
  }

  post<TData = unknown>(
    path: string,
    body?: RequestBody,
    config?: RequestConfig,
  ): Promise<ApiResponse<TData>> {
    return this.request<TData>("POST", path, body, config);
  }

  put<TData = unknown>(
    path: string,
    body?: RequestBody,
    config?: RequestConfig,
  ): Promise<ApiResponse<TData>> {
    return this.request<TData>("PUT", path, body, config);
  }

  patch<TData = unknown>(
    path: string,
    body?: RequestBody,
    config?: RequestConfig,
  ): Promise<ApiResponse<TData>> {
    return this.request<TData>("PATCH", path, body, config);
  }

  delete<TData = unknown>(
    path: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<TData>> {
    return this.request<TData>("DELETE", path, undefined, config);
  }

  postForm<TData = unknown>(
    path: string,
    data: FormDataInput,
    config?: RequestConfig,
  ): Promise<ApiResponse<TData>> {
    return this.request<TData>("POST", path, toFormData(data), config);
  }

  putForm<TData = unknown>(
    path: string,
    data: FormDataInput,
    config?: RequestConfig,
  ): Promise<ApiResponse<TData>> {
    return this.request<TData>("PUT", path, toFormData(data), config);
  }

  patchForm<TData = unknown>(
    path: string,
    data: FormDataInput,
    config?: RequestConfig,
  ): Promise<ApiResponse<TData>> {
    return this.request<TData>("PATCH", path, toFormData(data), config);
  }

  async getPaginated<TItem = unknown>(
    path: string,
    params?: PaginationParams,
    config: RequestConfig = {},
  ): Promise<PaginatedResponse<TItem>> {
    const merged: RequestConfig = {
      ...config,
      params: { ...params, ...config.params },
    };

    const { response, payload } = await this.send(
      "GET",
      path,
      undefined,
      merged,
    );
    const envelope = toApiResponse<unknown>(payload, response);
    const { items, meta } = extractList(payload);

    if (!Array.isArray(items)) {
      throw new ApiError({
        message: `Expected a list payload from GET ${response.url}`,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        method: "GET",
        code: API_ERROR_CODE.PARSE,
        body: payload,
      });
    }

    return {
      ...envelope,
      data: items as TItem[],
      meta: toPaginationMeta(meta, items.length),
    };
  }

  async raw(
    method: HttpMethod,
    path: string,
    body?: RequestBody,
    config: RequestConfig = {},
  ): Promise<Response> {
    return this.dispatch(method, path, body, config);
  }

  async request<TData = unknown>(
    method: HttpMethod,
    path: string,
    body?: RequestBody,
    config: RequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const { response, payload } = await this.send(method, path, body, config);
    return toApiResponse<TData>(payload, response);
  }

  private async send(
    method: HttpMethod,
    path: string,
    body: RequestBody | undefined,
    config: RequestConfig,
  ): Promise<{ response: Response; payload: unknown }> {
    const response = await this.dispatch(method, path, body, config);

    let payload: unknown = null;
    try {
      payload = await parseResponseBody(response);
    } catch (error) {
      if (response.ok) {
        throw new ApiError({
          message: `Failed to parse the response of ${method} ${response.url}`,
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          method,
          code: API_ERROR_CODE.PARSE,
          cause: error,
        });
      }
    }

    if (!response.ok) await this.fail(response, payload, method, config);

    return { response, payload };
  }

  private async dispatch(
    method: HttpMethod,
    path: string,
    body: RequestBody | undefined,
    config: RequestConfig,
  ): Promise<Response> {
    const {
      params,
      timeout,
      token: tokenOverride,
      skipAuth,
      baseUrl,
      dedupe,
      headers,
      signal,
      ...init
    } = config;

    const url = resolveUrl(baseUrl ?? this.baseUrl, path, params);
    const requestHeaders = new Headers(this.defaultHeaders);

    for (const [key, value] of new Headers(headers).entries()) {
      requestHeaders.set(key, value);
    }

    const token = await this.resolveToken(skipAuth, tokenOverride);
    if (token && !requestHeaders.has("Authorization")) {
      requestHeaders.set(
        "Authorization",
        this.authScheme ? `${this.authScheme} ${token}` : token,
      );
    }

    let requestBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      if (isFormData(body)) {
        requestBody = body;
        requestHeaders.delete("Content-Type");
      } else if (isJsonSerializable(body)) {
        requestBody = JSON.stringify(body);
        if (!requestHeaders.has("Content-Type")) {
          requestHeaders.set("Content-Type", "application/json");
        }
      } else {
        requestBody = body as BodyInit;
      }
    }

    try {
      return await fetch(url, {
        credentials: this.credentials,
        ...init,
        method,
        headers: requestHeaders,
        body: requestBody,
        signal: this.resolveSignal(signal, timeout, dedupe),
      });
    } catch (error) {
      throw this.toTransportError(error, method, url);
    }
  }

  private async resolveToken(
    skipAuth: boolean | undefined,
    override: string | null | undefined,
  ): Promise<string | null> {
    if (skipAuth) return null;
    if (override !== undefined) return override;

    if (this.tokenResolver) return (await this.tokenResolver()) ?? null;

    return this.token;
  }

  private resolveSignal(
    callerSignal: AbortSignal | null | undefined,
    requestTimeout: number | undefined,
    dedupe: boolean | undefined,
  ): AbortSignal | undefined {
    const signals: AbortSignal[] = [];

    if (callerSignal) signals.push(callerSignal);

    const timeout = requestTimeout ?? this.timeout;
    if (timeout && timeout > 0) signals.push(AbortSignal.timeout(timeout));

    if (signals.length === 0) {
      return dedupe === false ? new AbortController().signal : undefined;
    }

    return signals.length === 1 ? signals[0] : AbortSignal.any(signals);
  }

  private async fail(
    response: Response,
    payload: unknown,
    method: HttpMethod,
    config: RequestConfig,
  ): Promise<never> {
    const error = new ApiError({
      message: extractErrorMessage(payload, response),
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      method,
      body: payload,
    });

    if (response.status === 401 && !config.skipUnauthorizedHandler) {
      await this.onUnauthorized?.(error);
    }

    throw error;
  }

  private toTransportError(
    error: unknown,
    method: HttpMethod,
    url: string,
  ): ApiError {
    if (ApiError.is(error)) return error;

    const name = error instanceof Error ? error.name : "";

    if (name === "TimeoutError") {
      return new ApiError({
        message: `${method} ${url} timed out`,
        status: 0,
        url,
        method,
        code: API_ERROR_CODE.TIMEOUT,
        cause: error,
      });
    }

    if (name === "AbortError") {
      return new ApiError({
        message: `${method} ${url} was aborted`,
        status: 0,
        url,
        method,
        code: API_ERROR_CODE.ABORTED,
        cause: error,
      });
    }

    return new ApiError({
      message:
        error instanceof Error ? error.message : `${method} ${url} failed`,
      status: 0,
      url,
      method,
      code: API_ERROR_CODE.NETWORK,
      cause: error,
    });
  }
}
