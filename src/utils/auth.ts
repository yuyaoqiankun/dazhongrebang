import type { Context } from "hono";
import { config } from "../config.js";

export const isJsonRequest = (c: Context) => {
  const format = (c.req.query("format") || "").toLowerCase();
  const accept = c.req.header("accept") || "";
  return format === "json" || accept.includes("application/json");
};

export const isAuthorized = (_c: Context) => true;

export const unauthorizedResponse = () => {
  return {
    code: 401,
    message: "Unauthorized. Provide x-api-key, Authorization: Bearer <key>, or ?key=<key>",
  };
};
