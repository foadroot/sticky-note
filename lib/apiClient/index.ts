import { ApiClient } from "./api-client.service";

export const api = ApiClient.getInstance();

export { ApiClient };
export { ApiError, API_ERROR_CODE } from "./api.error";
export type { ApiErrorCode } from "./api.error";
export { toFormData } from "./api.utils";
export type {
  ApiClientConfig,
  ApiResponse,
  FormDataInput,
  HttpMethod,
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
  QueryParams,
  RequestBody,
  RequestConfig,
  TokenResolver,
} from "./api.types";
