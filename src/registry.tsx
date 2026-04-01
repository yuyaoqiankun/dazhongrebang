import { fileURLToPath } from "url";
import { config } from "./config.js";
import { Hono } from "hono";
import getRSS from "./utils/getRSS.js";
import path from "path";
import fs from "fs";
import All from "./views/All.js";
import Leaderboard from "./views/Leaderboard.js";
import { publicRoutes, publicRouteNames } from "./public-routes.js";
import { initRouteHealth, recordRouteFailure, recordRouteSuccess } from "./utils/health.js";
import { isAuthorized, isJsonRequest, unauthorizedResponse } from "./utils/auth.js";

const app = new Hono();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let allRoutePath: Array<string> = [];
const routersDirName: string = "routes";

const routersDirPath = path.join(__dirname, routersDirName);

const findTsFiles = (dirPath: string, allFiles: string[] = [], basePath: string = ""): string[] => {
  const items: Array<string> = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const fullPath: string = path.join(dirPath, item);
    const relativePath: string = basePath ? path.posix.join(basePath, item) : item;
    const stat: fs.Stats = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findTsFiles(fullPath, allFiles, relativePath);
    } else if (
      stat.isFile() &&
      (item.endsWith(".ts") || item.endsWith(".js")) &&
      !item.endsWith(".d.ts")
    ) {
      allFiles.push(relativePath.replace(/\.(ts|js)$/, ""));
    }
  });
  return allFiles;
};

if (fs.existsSync(routersDirPath) && fs.statSync(routersDirPath).isDirectory()) {
  allRoutePath = findTsFiles(routersDirPath).filter((route) => publicRouteNames.includes(route));
} else {
  console.error(`📂 The directory ${routersDirPath} does not exist or is not a directory`);
}

publicRoutes.forEach((route) => initRouteHealth(route.name, route.title));

const shouldRenderHtml = (acceptHeader: string | undefined, formatQuery: string | undefined) => {
  if (formatQuery === "json") return false;
  if (formatQuery === "html") return true;
  return (acceptHeader || "").includes("text/html");
};

for (let index = 0; index < allRoutePath.length; index++) {
  const router = allRoutePath[index];
  const listApp = app.basePath(`/${router}`);
  listApp.get("/", async (c) => {
    const startTime = Date.now();
    const noCache = c.req.query("cache") === "false";
    const limit = c.req.query("limit");
    const rssEnabled = c.req.query("rss") === "true";
    try {
      const { handleRoute } = await import(`./routes/${router}.js`);
      const listData = await handleRoute(c, noCache);
      if (limit && listData?.data?.length > parseInt(limit)) {
        listData.total = parseInt(limit);
        listData.data = listData.data.slice(0, parseInt(limit));
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
      if (isJsonRequest(c) && !isAuthorized(c)) {
        return c.json(unauthorizedResponse(), 401);
      }
      if (shouldRenderHtml(c.req.header("accept"), c.req.query("format"))) {
        return c.html(<Leaderboard route={listData} />);
      }
      return c.json({ code: 200, ...listData });
    } catch (error) {
      recordRouteFailure(
        router,
        {
          at: new Date().toISOString(),
          message: error instanceof Error ? error.message : "Unknown error",
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
  if (isJsonRequest(c) && !isAuthorized(c)) {
    return c.json(unauthorizedResponse(), 401);
  }
  if (shouldRenderHtml(c.req.header("accept"), c.req.query("format"))) {
    return c.html(<All routes={publicRoutes} />);
  }
  return c.json(
    {
      code: 200,
      count: allRoutePath.length,
      routes: publicRoutes.map((route) => ({ name: route.name, title: route.title, path: `/${route.name}` })),
    },
    200,
  );
});

export default app;
