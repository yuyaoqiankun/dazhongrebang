import type { FC } from "hono/jsx";
import Layout from "./Layout.js";
import { publicRoutes } from "../public-routes.js";

const exampleBase = "http://localhost:6688";

const Docs: FC = () => {
  return (
    <Layout title="API 文档 | DailyHot API">
      <main className="page-shell">
        <section className="page-head page-head-left">
          <span className="eyebrow">API Docs</span>
          <h1>接口文档</h1>
          <p>浏览器默认返回榜单页面，程序调用时请带上 `?format=json` 获取 JSON 数据。</p>
          <div className="page-actions">
            <a className="page-action" href="/all">
              查看榜单目录
            </a>
            <a className="page-action" href="/all?format=json">
              查看 JSON 路由清单
            </a>
            <a className="page-action" href="/health">
              查看健康状态
            </a>
          </div>
        </section>

        <section className="page-head page-head-left">
          <h2>通用规则</h2>
          <div className="docs-list">
            <div className="docs-item">
              <strong>抓取时机</strong>
              <span>本项目不是后台定时抓取。只有当浏览器或程序请求某个榜单时，才会检查缓存并决定是否重新抓取。</span>
            </div>
            <div className="docs-item">
              <strong>默认抓取间隔</strong>
              <span>默认缓存 3600 秒。缓存期内重复请求直接返回缓存；缓存过期后的下一次请求才会重新抓取。</span>
            </div>
            <div className="docs-item">
              <strong>JSON 授权</strong>
              <span>如果配置了 `API_ACCESS_KEY`，所有 `?format=json` 接口都需要携带 Key；HTML 页面默认仍可公开访问。</span>
            </div>
            <div className="docs-item">
              <strong>HTML 页面</strong>
              <code>{exampleBase}/weibo</code>
            </div>
            <div className="docs-item">
              <strong>JSON 数据</strong>
              <code>{exampleBase}/weibo?format=json</code>
            </div>
            <div className="docs-item">
              <strong>强制刷新缓存</strong>
              <code>{exampleBase}/weibo?format=json&cache=false</code>
            </div>
            <div className="docs-item">
              <strong>限制返回条数</strong>
              <code>{exampleBase}/weibo?format=json&limit=10</code>
            </div>
            <div className="docs-item">
              <strong>Header 鉴权</strong>
              <code>x-api-key: &lt;your-key&gt;</code>
            </div>
            <div className="docs-item">
              <strong>Query 鉴权</strong>
              <code>{exampleBase}/weibo?format=json&key=your-key</code>
            </div>
            <div className="docs-item">
              <strong>RSS 输出</strong>
              <code>{exampleBase}/weibo?rss=true</code>
            </div>
          </div>
        </section>

        <section className="page-head page-head-left">
          <h2>调用示例</h2>
          <div className="docs-code-grid">
            <div className="docs-code-card">
              <div className="docs-code-head">
                <strong>curl</strong>
                <span>命令行快速验证</span>
              </div>
              <pre className="code-block">{`curl -H "x-api-key: your-key" "${exampleBase}/weibo?format=json&cache=false"`}</pre>
            </div>
            <div className="docs-code-card">
              <div className="docs-code-head">
                <strong>JavaScript</strong>
                <span>浏览器 / Node.js</span>
              </div>
              <pre className="code-block">{`const res = await fetch("${exampleBase}/zhihu?format=json&limit=10", {
  headers: { "x-api-key": "your-key" }
});
const data = await res.json();

console.log(data.title);
console.log(data.data[0].title);`}</pre>
            </div>
            <div className="docs-code-card">
              <div className="docs-code-head">
                <strong>Python</strong>
                <span>requests 调用</span>
              </div>
              <pre className="code-block">{`import requests

res = requests.get(
    "${exampleBase}/baidu?format=json&cache=false",
    headers={"x-api-key": "your-key"}
)
data = res.json()

print(data["title"])
print(data["data"][0]["title"])`}</pre>
            </div>
          </div>
        </section>

        <section className="page-head page-head-left">
          <h2>接口参数</h2>
          <div className="docs-table">
            <div className="docs-row">
              <strong>format</strong>
              <span>`json` 返回 JSON，`html` 返回榜单页</span>
            </div>
            <div className="docs-row">
              <strong>cache</strong>
              <span>`false` 时跳过缓存重新抓取</span>
            </div>
            <div className="docs-row">
              <strong>limit</strong>
              <span>限制返回前 N 条数据</span>
            </div>
            <div className="docs-row">
              <strong>rss</strong>
              <span>`true` 时返回 RSS XML</span>
            </div>
          </div>
        </section>

        <section className="page-head page-head-left">
          <h2>返回结构</h2>
          <pre className="code-block">{`{
  "code": 200,
  "name": "weibo",
  "title": "微博",
  "type": "热搜榜",
  "description": "实时热点，每分钟更新一次",
  "link": "https://s.weibo.com/top/summary/",
  "total": 50,
  "fromCache": false,
  "updateTime": "2026-04-01T13:33:10.295Z",
  "data": [
    {
      "id": "xxx",
      "title": "某条热点",
      "hot": 123456,
      "timestamp": 1743510000000,
      "url": "https://...",
      "mobileUrl": "https://..."
    }
  ]
}`}</pre>
        </section>

        <section className="route-grid">
          {publicRoutes.map((route) => (
            <a className="route-card" href={`/${route.name}?format=json`}>
              <span className="route-name">{route.title}</span>
              <span className="route-type">{route.type}</span>
              <p>{route.description}</p>
              <code>/{route.name}?format=json</code>
            </a>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default Docs;
