# API 文档

本项目当前提供 16 个大众热点源，同时支持：

- 浏览器 HTML 榜单页
- JSON API
- RSS 输出

服务默认地址：`http://localhost:6688`

## 调用规则

浏览器榜单页：

```text
GET /weibo
```

JSON 数据：

```text
GET /weibo?format=json
```

带 API Key：

```text
GET /weibo?format=json&key=your-key
```

强制刷新缓存：

```text
GET /weibo?format=json&cache=false
```

限制返回条数：

```text
GET /weibo?format=json&limit=10
```

RSS：

```text
GET /weibo?rss=true
```

## 参数说明

| 参数 | 说明 |
| --- | --- |
| `format=json` | 强制返回 JSON |
| `format=html` | 强制返回 HTML |
| `cache=false` | 跳过缓存重新抓取 |
| `limit=10` | 仅返回前 N 条 |
| `rss=true` | 输出 RSS XML |
| `key=<your-key>` | JSON 接口鉴权 Key |

## API Key 说明

如果设置了环境变量 `API_ACCESS_KEY`，则以下 JSON 接口都需要鉴权：

- `/all?format=json`
- `/<route>?format=json`
- `/health?format=json`

可选鉴权方式：

- Header：`x-api-key: <your-key>`
- Header：`Authorization: Bearer <your-key>`
- Query：`?key=<your-key>`

HTML 页面默认不受影响。

## 接口列表

| 名称 | 路径 |
| --- | --- |
| 百度 | `/baidu?format=json` |
| 哔哩哔哩 | `/bilibili?format=json` |
| 抖音 | `/douyin?format=json` |
| IT之家 | `/ithome?format=json` |
| 网易新闻 | `/netease-news?format=json` |
| 腾讯新闻 | `/qq-news?format=json` |
| 新浪网 | `/sina?format=json` |
| 新浪新闻 | `/sina-news?format=json` |
| 澎湃新闻 | `/thepaper?format=json` |
| 百度贴吧 | `/tieba?format=json` |
| 今日头条 | `/toutiao?format=json` |
| 中央气象台 | `/weatheralarm?format=json` |
| 微博 | `/weibo?format=json` |
| 微信读书 | `/weread?format=json` |
| 知乎 | `/zhihu?format=json` |

## 返回结构

```json
{
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
}
```

## 站内文档

启动服务后可直接访问：

- `http://localhost:6688/docs`
- `http://localhost:6688/all`
- `http://localhost:6688/health`

## Vercel 部署

项目已包含可直接部署到 Vercel 的入口：

- `api/index.ts`
- `vercel.json`

部署后访问规则不变：

- `/` 首页
- `/docs` 文档页
- `/all` 榜单目录
- `/<route>?format=json` JSON API

默认行为说明：

- 在 Vercel / Serverless 环境中，`USE_LOG_FILE` 默认关闭
- 不配置 Redis 也可以运行，会自动退回内存缓存
- 若要减少部署上传内容，可直接使用仓库中的 `.vercelignore`
