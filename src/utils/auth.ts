import type { Context } from "hono";
import { config } from "../config.js";

export const isJsonRequest = (c: Context) => {
  const format = (c.req.query("format") || "").toLowerCase();
  const accept = c.req.header("accept") || "";
  return format === "json" || accept.includes("application/json");
};

export const isAuthorized = (c: Context) => {
  if (!config.API_ACCESS_KEY) return true;
  const headerKey = c.req.header("x-api-key") || c.req.header("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const queryKey = c.req.query("key") || "";
  return headerKey === config.API_ACCESS_KEY || queryKey === config.API_ACCESS_KEY;
};

export const unauthorizedResponse = () => {
  return {
    code: 401,
    message: "Unauthorized. Provide x-api-key, Authorization: Bearer <key>, or ?key=<key>",
  };
};
