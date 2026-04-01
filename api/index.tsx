import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { prettyJSON } from "hono/pretty-json";
import { trimTrailingSlash } from "hono/trailing-slash";
import { serveStatic } from "@hono/node-server/serve-static";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { config } from "../src/config.js";
import robotstxt from "../src/robots.txt.js";
import NotFound from "../src/views/NotFound.js";
import Home from "../src/views/Home.js";
import Error from "../src/views/Error.js";
import Docs from "../src/views/Docs.js";
import Health from "../src/views/Health.js";
import All from "../src/views/All.js";
import Leaderboard from "../src/views/Leaderboard.js";
import getRSS from "../src/utils/getRSS.js";
import { isJsonRequest } from "../src/utils/auth.js";
import { publicRoutes, publicRouteNames } from "../src/public-routes.js";
import { getHealthSummary, initRouteHealth, recordRouteFailure, recordRouteSuccess } from "../src/utils/health.js";
import logger from "../src/utils/logger.js";

const app = new Hono();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const routesDirPath = path.join(projectRoot, "src", "routes");

app.use(compress());
app.use(prettyJSON());
app.use(trimTrailingSlash());

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return config.ALLOWED_DOMAIN;
      const isSame = config.ALLOWED_HOST && origin.endsWith(config.ALLOWED_HOST);
      return isSame ? origin : config.ALLOWED_DOMAIN;
    },
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    credentials: true,
  }),
);

app.use(
  "/*",
  serveStatic({
    root: "./public",
    rewriteRequestPath: (routePath) => (routePath === "/favicon.ico" ? "/favicon.png" : routePath),
  }),
);

const findRouteFiles = (dirPath: string, allFiles: Array<string> = [], basePath = "") => {
  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const relativePath = basePath ? path.posix.join(basePath, item) : item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findRouteFiles(fullPath, allFiles, relativePath);
      return;
    }
    if (stat.isFile() && (item.endsWith(".ts") || item.endsWith(".js")) && !item.endsWith(".d.ts")) {
      allFiles.push(relativePath.replace(/\.(ts|js)$/, ""));
    }
  });
  return allFiles;
};

const allRoutePath = fs.existsSync(routesDirPath) && fs.statSync(routesDirPath).isDirectory()
  ? findRouteFiles(routesDirPath).filter((route) => publicRouteNames.includes(route))
  : [];

publicRoutes.forEach((route) => initRouteHealth(route.name, route.title));

const shouldRenderHtml = (acceptHeader: string | undefined, formatQuery: string | undefined) => {
  if (formatQuery === "json") return false;
  if (formatQuery === "html") return true;
  return (acceptHeader || "").includes("text/html");
};

const getErrorMessage = (error: unknown) => {
  return typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
    ? error.message
    : "Unknown error";
};

for (const router of allRoutePath) {
  const listApp = app.basePath(`/${router}`);
  listApp.get("/", async (c) => {
    const startTime = Date.now();
    const noCache = c.req.query("cache") === "false";
    const limit = c.req.query("limit");
    const rssEnabled = c.req.query("rss") === "true";
    try {
      const routeModule = await import(`../src/routes/${router}.js`);
      const listData = await routeModule.handleRoute(c, noCache);
      if (limit && listData?.data?.length > parseInt(limit, 10)) {
        listData.total = parseInt(limit, 10);
        listData.data = listData.data.slice(0, parseInt(limit, 10));
      }
      recordRouteSuccess(router, {
        title: listData.title,
        lastFetchAt: new Date().toISOString(),
        lastSuccessAt: new Date().toISOString(),
        lastDurationMs: Date.now() - startTime,
        lastResultCount: listData.total,
        fromCache: listData.fromCache,
      });
      if (rssEnabled || config.RSS_MODE) {
        const rss = getRSS(listData);
        if (typeof rss === "string") {
          c.header("Content-Type", "application/xml; charset=utf-8");
          return c.body(rss);
        }
        return c.json({ code: 500, message: "RSS generation failed" }, 500);
      }
      if (shouldRenderHtml(c.req.header("accept"), c.req.query("format"))) {
        return c.html(<Leaderboard route={listData} />);
      }
      return c.json({ code: 200, ...listData });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      recordRouteFailure(
        router,
        {
          at: new Date().toISOString(),
          message: errorMessage,
        },
        {
          title: publicRoutes.find((route) => route.name === router)?.title,
          lastDurationMs: Date.now() - startTime,
        },
      );
      throw error;
    }
  });
  listApp.all("*", (c) => c.json({ code: 405, message: "Method Not Allowed" }, 405));
}

app.get("/all", (c) => {
  if (shouldRenderHtml(c.req.header("accept"), c.req.query("format"))) {
    return c.html(<All routes={publicRoutes} />);
  }
  return c.json({
    code: 200,
    count: allRoutePath.length,
    routes: publicRoutes.map((route) => ({ name: route.name, title: route.title, path: `/${route.name}` })),
  });
});

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
  const message = getErrorMessage(err);
  logger.error(`❌ [ERROR] ${message}`);
  return c.html(<Error error={message} />, 500);
});

export default app;
