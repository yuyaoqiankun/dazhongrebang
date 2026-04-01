# 热榜抓取技术方案

本文档说明当前项目中每个热榜源的抓取实现方式、稳定性特点，以及部署到 Vercel 后的访问控制建议。

## 当前抓取机制

项目当前不是后台定时任务抓取，而是：

1. 用户或程序请求某个榜单接口
2. 先检查缓存
3. 缓存有效则直接返回缓存
4. 缓存过期或带 `cache=false` 时，重新请求上游站点

默认缓存时间：`3600 秒`

也就是：

- 默认 1 小时内重复请求同一榜单，通常返回缓存
- 1 小时后下一次被请求时，才会重新抓取

## 各热榜源抓取方案

### 百度 `baidu`

- 技术方案：抓取网页 HTML，再从 HTML 注释中的 `s-data` JSON 提取榜单
- 上游入口：`https://top.baidu.com/board?tab=<type>`
- 方案类型：`HTML + 内嵌 JSON`
- 稳定性：中等

### 哔哩哔哩 `bilibili`

- 技术方案：优先请求官方排名 API，附带 WBI 签名；失败时切换到备用 API
- 上游入口：`https://api.bilibili.com/x/web-interface/ranking/v2`
- 方案类型：`官方 JSON API + WBI 签名 + 备用接口`
- 稳定性：较高

### 抖音 `douyin`

- 技术方案：请求移动端风格热榜接口，使用 `android + aid=1128 + okhttp3` 风格参数；跳转链接使用搜索页
- 上游入口：`https://aweme.snssdk.com/aweme/v1/hot/search/list/`
- 方案类型：`移动端 JSON API`
- 稳定性：中等
- 备注：参考了 `dyttzhwb-4hot-hub` 中的抖音实现思路

### IT之家 `ithome`

- 技术方案：抓取移动端排行榜页面 HTML，用 Cheerio 解析 DOM
- 上游入口：`https://m.ithome.com/rankm/`
- 方案类型：`HTML DOM 解析`
- 稳定性：中等

### 网易新闻 `netease-news`

- 技术方案：请求公开 JSON 接口
- 上游入口：`https://m.163.com/fe/api/hot/news/flow`
- 方案类型：`JSON API`
- 稳定性：较高

### 腾讯新闻 `qq-news`

- 技术方案：请求公开 JSON 接口
- 上游入口：`https://r.inews.qq.com/gw/event/hot_ranking_list`
- 方案类型：`JSON API`
- 稳定性：较高

### 新浪网 `sina`

- 技术方案：请求新闻 App 热榜 JSON 接口
- 上游入口：`https://newsapp.sina.cn/api/hotlist`
- 方案类型：`JSON API`
- 稳定性：中等到较高

### 新浪新闻 `sina-news`

- 技术方案：请求返回 JavaScript 变量文本的接口，再手动剥离并解析 JSON
- 上游入口：`https://top.<subdomain>.sina.com.cn/ws/GetTopDataList.php`
- 方案类型：`JSONP/JS 文本解析`
- 稳定性：中等

### 澎湃新闻 `thepaper`

- 技术方案：请求公开 JSON 接口
- 上游入口：`https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar`
- 方案类型：`JSON API`
- 稳定性：较高

### 百度贴吧 `tieba`

- 技术方案：请求公开 JSON 接口
- 上游入口：`https://tieba.baidu.com/hottopic/browse/topicList`
- 方案类型：`JSON API`
- 稳定性：较高

### 今日头条 `toutiao`

- 技术方案：请求公开热榜 JSON 接口
- 上游入口：`https://www.toutiao.com/hot-event/hot-board/`
- 方案类型：`JSON API`
- 稳定性：较高

### 中央气象台 `weatheralarm`

- 技术方案：请求官方预警 JSON 接口
- 上游入口：`http://www.nmc.cn/rest/findAlarm`
- 方案类型：`JSON API`
- 稳定性：较高

### 微博 `weibo`

- 技术方案：请求微博热搜 JSON 接口
- 上游入口：`https://weibo.com/ajax/side/hotSearch`
- 方案类型：`JSON API`
- 稳定性：较高
- 特别说明：该路由当前单独设置了 `ttl: 60`，也就是微博热搜缓存 60 秒

### 微信读书 `weread`

- 技术方案：请求榜单 JSON 接口，书籍详情跳转链接需要额外转换 ID
- 上游入口：`https://weread.qq.com/web/bookListInCategory/<type>?rank=1`
- 方案类型：`JSON API + 链接 ID 转换`
- 稳定性：中等到较高

### 知乎 `zhihu`

- 技术方案：请求知乎热榜 JSON 接口，可选携带 `ZHIHU_COOKIE`
- 上游入口：`https://api.zhihu.com/topstory/hot-lists/total?limit=50`
- 方案类型：`JSON API`
- 稳定性：中等到较高

## 稳定性分层

更稳的一类：

- `bilibili`
- `netease-news`
- `qq-news`
- `thepaper`
- `tieba`
- `toutiao`
- `weatheralarm`
- `weibo`

中等稳定的一类：

- `baidu`
- `douyin`
- `ithome`
- `sina`
- `sina-news`
- `weread`
- `zhihu`

影响稳定性的核心因素：

- 上游接口是否公开稳定
- 是否依赖签名、Cookie 或移动端参数
- 是否需要解析 HTML 或页面内嵌数据
- 是否容易触发反爬、限流或接口结构变更

## 如何判断抓取失败

当前项目已提供：

- `/health`：HTML 健康状态页
- `/health?format=json`：JSON 健康状态接口

可以看到：

- 最近抓取时间
- 最近成功时间
- 最近失败时间
- 连续失败次数
- 最近错误信息
- 最近结果数量
- 最近耗时

同时日志中会记录结构化错误信息，包括：

- 请求方法
- 请求 URL
- HTTP 状态码
- error code
- error message
- 上游响应片段

## Vercel 部署后是不是谁都能访问

默认情况下：**是的**。

如果你把项目部署到 Vercel，并且不做额外控制，那么任何知道域名的人都可以访问：

- `/`
- `/all`
- `/docs`
- `/health`
- `/<route>?format=json`

当前项目默认仅做了：

- `CORS` 控制

但要注意：

- `CORS` 只限制浏览器跨域读取
- **不能阻止别人直接访问你的 URL**
- 所以它不是认证方案，也不是防盗用方案

## 能不能加限制或授权

可以，常见方案如下。

### 方案 1：简单 API Key

做法：

- 增加环境变量，例如 `API_ACCESS_KEY`
- 所有 JSON 接口必须携带：
  - Header：`x-api-key: <your-key>`
  - 或 Query：`?key=<your-key>`

优点：

- 最简单
- 最容易接进当前项目

缺点：

- Key 泄露后就失效
- 不适合复杂权限体系

推荐度：高

### 方案 2：Basic Auth

做法：

- 给 `/docs`、`/all`、`/<route>` 等接口增加 Basic Auth

优点：

- 实现简单

缺点：

- 对程序调用不够灵活
- 凭据管理体验一般

推荐度：中

### 方案 3：只开放页面，隐藏 JSON

做法：

- 对浏览器页面保留公开访问
- 对 `?format=json` 或 `/health?format=json` 增加 Key 校验

优点：

- 页面可公开展示
- API 不完全裸奔

推荐度：高

### 方案 4：Vercel 前置保护

做法：

- 使用 Vercel Authentication / Edge Middleware
- 或接入上游网关、Cloudflare、Nginx 做认证

优点：

- 更适合正式公网服务

缺点：

- 配置复杂度更高

推荐度：中到高

### 方案 5：限流

做法：

- 按 IP 或 API Key 做频率限制
- 比如每分钟最多 30 次

优点：

- 能防止被别人高频刷爆

缺点：

- 不是认证，只是减轻滥用

推荐度：高

## 推荐的授权方案

如果你准备把它部署到 Vercel 并真正公开使用，我建议：

1. 给 JSON API 增加 `x-api-key`
2. 给 `/health` 也加保护
3. 保留 `/`、`/all` 页面公开访问
4. 对所有 API 请求做简单限流

这样能兼顾：

- 页面可公开展示
- 接口不完全裸奔
- 降低被刷和被盗用风险

## 如果要继续做下一步

建议优先顺序：

1. 先加 `API Key` 认证
2. 再加 `/health` 权限控制
3. 最后加限流
