import type { Context } from "hono";

export interface ListItem {
  id?: string | number;
  title: string;
  desc?: string;
  cover?: string;
  author?: string;
  hot?: string | number;
  timestamp?: number;
  url?: string;
  mobileUrl?: string;
}

export interface RouterData {
  name: string;
  title: string;
  type: string;
  description?: string;
  link?: string;
  total: number;
  updateTime: string;
  fromCache: boolean;
  data: Array<ListItem>;
  params?: Record<string, { name: string; type?: Record<string, string>; value?: string }>;
}

export interface RequestOptions {
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
  noCache?: boolean;
  ttl?: number;
  originaInfo?: boolean;
}

export interface Get extends RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  responseType?: "json" | "text" | "arraybuffer" | "stream" | "document" | "blob";
}

export interface Post extends RequestOptions {
  body?: unknown;
}

export type ListContext = Context;

export type Options = Record<string, string>;

export interface RouterResType {
  fromCache: boolean;
  updateTime: string;
  data: Array<ListItem>;
}
