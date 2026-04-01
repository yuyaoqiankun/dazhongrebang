import type { FC } from "hono/jsx";
import Layout from "./Layout.js";
import type { RouteHealthInfo } from "../utils/health.js";

interface HealthProps {
  total: number;
  ok: number;
  error: number;
  idle: number;
  routes: RouteHealthInfo[];
}

const Health: FC<HealthProps> = (props) => {
  return (
    <Layout title="健康检查 | DailyHot API">
      <main className="page-shell">
        <section className="page-head page-head-left">
          <span className="eyebrow">Health Check</span>
          <h1>抓取健康状态</h1>
          <p>这里显示每个榜单最近一次成功、失败、耗时、结果数量和失败原因。只有当接口被实际请求后，状态才会更新。</p>
          <div className="page-meta">
            <span>总数 {props.total}</span>
            <span>正常 {props.ok}</span>
            <span>失败 {props.error}</span>
            <span>未触发 {props.idle}</span>
          </div>
          <div className="page-actions">
            <a className="page-action" href="/health?format=json">
              查看 JSON
            </a>
            <a className="page-action" href="/all">
              返回榜单目录
            </a>
          </div>
        </section>
        <section className="leaderboard-list">
          {props.routes.map((route) => (
            <div className="health-item">
              <div className="health-head">
                <strong>{route.title || route.route}</strong>
                <span className={`health-badge ${route.status}`}>{route.status}</span>
              </div>
              <div className="leaderboard-meta">
                <span>路由 /{route.route}</span>
                <span>最近抓取 {route.lastFetchAt || "-"}</span>
                <span>最近成功 {route.lastSuccessAt || "-"}</span>
                <span>最近失败 {route.lastFailureAt || "-"}</span>
                <span>耗时 {route.lastDurationMs ?? "-"} ms</span>
                <span>条目数 {route.lastResultCount ?? "-"}</span>
                <span>连续失败 {route.consecutiveFailures}</span>
                <span>{route.fromCache ? "来自缓存" : "非缓存/未知"}</span>
              </div>
              {route.lastError ? (
                <pre className="code-block">{JSON.stringify(route.lastError, null, 2)}</pre>
              ) : null}
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default Health;
