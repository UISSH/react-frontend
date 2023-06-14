export const CURRENT_GATEWAY_API = "CURRENT_GATEWAY_API";
export const CURRENT_GATEWAY_WS = "CURRENT_GATEWAY_WS";
export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const USER_INFO = "USER_INFO";
export const LOGIN_INFO = "LOGIN_INFO";
export const REMEMBER_ME = "REMEMBER_ME";
export const TERMINAL_SNIPPET_PREFIX = "terminal_snippet_";
export const SHORTCUT_UNIQUE = "SHORTCUTUNIQUE_V2";

export interface DjangoPaginationIF<T> {
  pagination: Pagination;
  results: T[];
}

interface Pagination {
  total_pages: number;
  current_page: number;
  total_record: number;
  next: string;
  previous?: any;
}

export type ResultTextIF =
  | "PENDING"
  | "SUCCESS"
  | "FAILURE"
  | "PROCESSING"
  | "NOT_SUPPORT";

export interface OperatingResIF {
  event_id: string;
  result: {
    result: 0 | 1 | 2 | 3 | 4;
    result_text: ResultTextIF;
  };
  name: string;
  msg: string;
  create_at: string;
}
