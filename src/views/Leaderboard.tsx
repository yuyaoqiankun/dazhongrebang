import type { FC } from "hono/jsx";
import dayjs from "dayjs";
import Layout from "./Layout.js";
import type { ListItem, RouterData } from "../types.js";
import { publicRoutes } from "../public-routes.js";

interface LeaderboardProps {
  route: RouterData;
}

const formatTime = (timestamp?: number) => {
  if (!timestamp) return "-";
  return dayjs(timestamp).format("MM-DD HH:mm");
};

const formatHot = (hot?: string | number) => {
  if (hot === undefined || hot === null) return "-";
  if (typeof hot === "number") return hot.toLocaleString("zh-CN");
  return hot;
};

const getTargetUrl = (item: ListItem) => item.mobileUrl || item.url;

const Leaderboard: FC<LeaderboardProps> = (props) => {
  const { route } = props;
  return (
    <Layout title={`${route.title}${route.type} | DailyHot API`}>
      <main className="page-shell">
        <section className="page-head page-head-left">
          <a className="back-link" href="/all">
            返回榜单目录
          </a>
          <span className="eyebrow">{route.name}</span>
          <h1>
            {route.title}{route.type}
          </h1>
          <p>{route.description || "实时聚合热点内容"}</p>
          <div className="page-meta">
            <span>更新时间：{dayjs(route.updateTime).format("YYYY-MM-DD HH:mm:ss")}</span>
            <span>条目数：{route.total}</span>
            <span>{route.fromCache ? "缓存结果" : "实时抓取"}</span>
          </div>
          <div className="page-actions">
            <a className="page-action" href={`/${route.name}?cache=false`}>
              刷新榜单
            </a>
            <a className="page-action" href={`/${route.name}?format=json`}>
              查看 JSON
            </a>
            {route.link ? (
              <a className="page-action" href={route.link} target="_blank" rel="noreferrer">
                打开源站
              </a>
            ) : null}
          </div>
        </section>
        <nav className="leaderboard-nav">
          {publicRoutes.map((entry) => (
            <a
              className={`leaderboard-tab${entry.name === route.name ? " active" : ""}`}
              href={`/${entry.name}`}
            >
              <span>{entry.title}</span>
              <small>{entry.type}</small>
            </a>
          ))}
        </nav>
        <section className="leaderboard-list">
          {route.data.map((item, index) => (
            <a
              className="leaderboard-item"
              href={getTargetUrl(item)}
              target="_blank"
              rel="noreferrer"
            >
              <span className="leaderboard-rank">{index + 1}</span>
              <div className="leaderboard-main">
                <h2>{item.title}</h2>
                {item.desc ? <p>{item.desc}</p> : null}
                <div className="leaderboard-meta">
                  <span>热度 {formatHot(item.hot)}</span>
                  <span>时间 {formatTime(item.timestamp)}</span>
                  {item.author ? <span>作者 {item.author}</span> : null}
                </div>
              </div>
            </a>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default Leaderboard;
