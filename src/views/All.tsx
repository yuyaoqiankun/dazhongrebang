import type { FC } from "hono/jsx";
import Layout from "./Layout.js";

interface RouteEntry {
  name: string;
  title: string;
  type: string;
  description?: string;
}

interface AllProps {
  routes: RouteEntry[];
}

const All: FC<AllProps> = (props) => {
  return (
    <Layout title="大众热点接口 | DailyHot API">
      <main className="page-shell">
        <section className="page-head">
          <span className="eyebrow">Public Hot List</span>
          <h1>大众热点榜单</h1>
          <p>浏览器访问将直接显示榜单页面，接口调用可继续通过 `?format=json` 获取原始 JSON。</p>
        </section>
        <section className="route-grid">
          {props.routes.map((route) => (
            <a className="route-card" href={`/${route.name}`}>
              <span className="route-name">{route.title}</span>
              <span className="route-type">{route.type}</span>
              <p>{route.description || "查看实时榜单"}</p>
              <code>/{route.name}</code>
            </a>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default All;
