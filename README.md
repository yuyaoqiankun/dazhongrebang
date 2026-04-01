# DailyHot API

一个聚合大众热点榜单的本地服务，支持：

- 浏览器可视化榜单页
- JSON API
- RSS 输出

当前项目已经收缩为 16 个高频大众热点源，并提供更适合直接使用的页面和接口文档。

## 当前能力

- 首页直接展示 16 个榜单入口卡片
- `/all` 提供榜单目录页
- `/<route>` 提供单个榜单展示页
- `/<route>?format=json` 提供原始 JSON API
- `/docs` 提供站内接口文档页
- `/health` 提供抓取健康状态页

## 已保留榜单

- `baidu`
- `bilibili`
- `douyin`
- `ithome`
- `netease-news`
- `qq-news`
- `sina`
- `sina-news`
- `thepaper`
- `tieba`
- `toutiao`
- `weatheralarm`
- `weibo`
- `weread`
- `zhihu`

## 运行方式

安装依赖：

```bash
npm install
```

开发模式：

```bash
npm run dev
```

构建：

```bash
npm run build
```

启动：

```bash
npm run start
```

默认访问地址：`http://localhost:6688`

## API Key 保护

如果设置环境变量 `API_ACCESS_KEY`，所有 JSON 接口都会要求鉴权：

- `x-api-key: <your-key>`
- `Authorization: Bearer <your-key>`
- 或查询参数 `?key=<your-key>`

HTML 页面默认仍可公开访问。

## Vercel 部署

项目已补充 Vercel Serverless 入口，可直接部署。

更完整的部署说明见：`./DEPLOY.md`

### 关键文件

- `api/index.ts`：Vercel Function 入口
- `vercel.json`：运行时与全路径重写配置

### 部署步骤

1. 将仓库推到 GitHub
2. 在 Vercel 中导入该仓库
3. Framework Preset 选择 `Other`
4. Build Command 使用默认值或填写：

```bash
npm run vercel-build
```

5. Output Directory 留空
6. Node.js 版本选择 `20.x`
7. 若需要自定义环境变量，在 Vercel Project Settings 中配置 `.env` 对应项

部署完成后：

- `/` 为首页
- `/docs` 为站内 API 文档
- `/all` 为榜单目录页
- `/<route>?format=json` 为 JSON API

### 本地模拟 Vercel

```bash
npm install
npm run vercel-build
vercel dev
```

### 部署检查清单

建议在正式部署前确认：

1. `Node.js` 版本为 `20.x`
2. Build Command 为 `npm run build`
3. 已存在 `api/index.ts` 与 `vercel.json`
4. 若不需要 Redis，不配置 `REDIS_*` 变量即可
5. 若需要更高稳定性，可适当提高 `REQUEST_TIMEOUT`
6. 如需控制跨域，配置 `ALLOWED_DOMAIN`
7. 生产环境默认已关闭文件日志，无需额外设置 `USE_LOG_FILE=false`

### .vercelignore

项目已包含 `.vercelignore`，会自动忽略：

- `node_modules`
- `dist`
- `logs`
- `.git`
- 编辑器目录和调试日志

这样可以减少上传体积，并避免把本地构建产物和日志带上云端。

## 页面入口

- 首页：`/`
- 榜单目录：`/all`
- 接口文档：`/docs`
- 健康状态：`/health`

## API 调用示例

微博 JSON：

```text
http://localhost:6688/weibo?format=json
```

带 API Key：

```text
http://localhost:6688/weibo?format=json&key=your-key
```

知乎 JSON 并强制刷新：

```text
http://localhost:6688/zhihu?format=json&cache=false
```

百度热搜前 10 条：

```text
http://localhost:6688/baidu?format=json&limit=10
```

获取全部接口列表：

```text
http://localhost:6688/all?format=json
```

RSS 输出：

```text
http://localhost:6688/weibo?rss=true
```

## 参数说明

| 参数 | 说明 |
| --- | --- |
| `format=json` | 返回 JSON |
| `format=html` | 返回 HTML |
| `cache=false` | 跳过缓存重新抓取 |
| `limit=10` | 仅返回前 N 条 |
| `rss=true` | 返回 RSS XML |
| `key=<your-key>` | JSON 接口鉴权 Key |

## 返回结构

```json
{
  "code": 200,
  "name": "weibo",
  "title": "微博",
  "type": "热搜榜",
  "description": "实时热点，每分钟更新一次",
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
}
```

## 其他文档

- 本地 API 文档：`./API.md`
- 部署文档：`./DEPLOY.md`
- 抓取技术方案：`./TECHNICAL_SCHEMES.md`
- 站内文档页：`/docs`

## 免责声明

本项目仅用于技术研究、开发调试和公开信息聚合展示。所有数据均来自公开来源，不保证长期稳定、不保证内容绝对准确，也不保证第三方上游接口长期可用。
