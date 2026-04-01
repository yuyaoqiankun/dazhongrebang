import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
import { prettyJSON } from "hono/pretty-json";
import { trimTrailingSlash } from "hono/trailing-slash";
import registry from "../src/registry.js";
import robotstxt from "../src/robots.txt.js";
import NotFound from "../src/views/NotFound.js";
import Home from "../src/views/Home.js";
import Error from "../src/views/Error.js";
import Docs from "../src/views/Docs.js";
import Health from "../src/views/Health.js";
import { getHealthSummary } from "../src/utils/health.js";
import { isJsonRequest } from "../src/utils/auth.js";

const app = new Hono();

app.use(compress());
app.use(prettyJSON());
app.use(trimTrailingSlash());

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
  }),
);

app.use(
  "/*",
  serveStatic({
    root: "./public",
    rewriteRequestPath: (path) => (path === "/favicon.ico" ? "/favicon.png" : path),
  }),
);

app.route("/", registry);

app.get("/robots.txt", robotstxt);
app.get("/", (c) => c.html(<Home />));
app.get("/docs", (c) => c.html(<Docs />));
app.get("/health", (c) => {
  const summary = getHealthSummary();
  if (isJsonRequest(c)) {
    return c.json({ code: 200, ...summary });
  }
  return c.html(<Health {...summary} />);
});
app.notFound((c) => c.html(<NotFound />, 404));
app.onError((err, c) => {
  console.error(`❌ [ERROR] ${err?.message}`);
  return c.html(<Error error={err?.message} />, 500);
});

export default app;
