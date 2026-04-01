# 部署说明

本文档说明当前项目在三种场景下的部署方式：

- 本地运行
- Docker 部署
- Vercel 部署

## 本地运行

安装依赖：

```bash
npm install
```

开发模式：

```bash
npm run dev
```

生产构建：

```bash
npm run build
npm run start
```

默认访问地址：`http://localhost:6688`

## Docker 部署

### 构建镜像

```bash
docker build -t dailyhot-api .
```

### 直接运行

```bash
docker run --restart always -p 6688:6688 -d dailyhot-api
```

### 使用 Docker Compose

```bash
docker-compose up -d
```

说明：

- Dockerfile 默认使用 `NODE_ENV=docker`
- 容器内会保留 `/app/logs`
- 当前 `docker-compose.yml` 会映射 `./logs:/app/logs`

## Vercel 部署

项目已包含：

- `api/index.ts`
- `vercel.json`
- `.vercelignore`

### 部署步骤

1. 将项目推送到 GitHub
2. 在 Vercel 中导入仓库
3. Framework Preset 选择 `Other`
4. Build Command 填写：

```bash
npm run vercel-build
```

5. Output Directory 留空
6. Node.js 版本选择 `20.x`

### 本地模拟

```bash
npm install
npm run vercel-build
vercel dev
```

### Vercel 环境说明

- 默认关闭文件日志
- 不配置 Redis 也可以运行
- 建议按需配置 `REQUEST_TIMEOUT`
- 可通过 `ALLOWED_DOMAIN` 控制跨域

### 部署后访问

- `/` 首页
- `/docs` 站内文档页
- `/all` 榜单目录
- `/<route>?format=json` JSON API

## 环境变量

常用配置项：

- `PORT`
- `CACHE_TTL`
- `REQUEST_TIMEOUT`
- `ALLOWED_DOMAIN`
- `ALLOWED_HOST`
- `USE_LOG_FILE`
- `RSS_MODE`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_DB`
- `ZHIHU_COOKIE`
- `FILTER_WEIBO_ADVERTISEMENT`

## 推荐做法

- 本地调试：`npm run dev`
- 自部署服务器：`npm run build && npm run start`
- Docker：使用 `docker-compose up -d`
- Vercel：使用 `npm run vercel-build`
