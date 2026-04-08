# 外部集成

**分析日期：** 2026-04-07

## 现状概览

- 当前仓库最明确、最核心的外部边界不是第三方 SaaS，而是本地 SQLite 数据库。
- 从已检查的代码与配置看，这个站点当前没有接入认证、支付、分析、邮件、队列或 webhook 平台。
- 站点本质上是一个只读目录前台，外部链接更多表现为“内容字段”，而不是“运行时服务依赖”。

## 数据库

### SQLite

- Drizzle 配置在 `site/drizzle.config.ts`
- 运行时连接在 `site/src/db/index.ts`
- schema 定义在 `site/src/db/schema.ts`
- 当前数据库驱动是 `better-sqlite3`
- 默认连接路径：
  - 优先读取环境变量 `DATABASE_URL`
  - 否则回退到 `data/powerup.db`

### 本地文件证据

- 工作区内已存在：
  - `site/data/powerup.db`
  - `site/data/powerup.db-shm`
  - `site/data/powerup.db-wal`
- `site/.gitignore` 对 `/data` 做了忽略，说明数据库预期是本地运行时产物，而不是仓库版本化资产。

## 内容来源与外链字段

- `site/src/db/schema.ts` 定义了这些与外部来源有关的字段：
  - `github_url`
  - `doc_url`
  - `source_url`
  - `source_kind`
- 这些字段的职责更偏“目录内容元数据”而不是“站点运行时集成”。
- `site/src/app/skill/[slug]/page.tsx` 会把 `doc_url` 和 `github_url` 渲染成外部跳转按钮。
- `source_url` 与 `source_kind` 目前属于内部治理字段，未在前台公开。

## Markdown 与内容渲染

- `site/src/components/skill/markdown-renderer.tsx` 使用 `react-markdown` + `remark-gfm`
- 外链渲染时，`href` 以 `http` 开头会自动带 `target="_blank"` 与 `rel="noreferrer"`
- 这是前端渲染层面的库集成，不是外部服务调用

## 目前没有观察到的集成

- 没有认证提供商配置，例如 Auth.js、Clerk、Supabase Auth、Firebase Auth
- 没有支付配置，例如 Stripe、Paddle、Lemon Squeezy
- 没有观测到分析或埋点 SDK，例如 GA、PostHog、Plausible
- 没有观测到邮件或通知服务，例如 Resend、SendGrid、Mailgun
- 没有观测到对象存储或 CDN 配置，例如 S3、R2、Cloudinary
- 没有观测到 webhook 入口或回调处理目录
- 没有观测到消息队列、任务调度、后台 worker

## 发布与部署线索

- 没有发现 `.github/workflows/*`
- 没有发现 `Dockerfile`、`docker-compose.yml`、`Caddyfile`
- 没有发现 `vercel.json`、`netlify.toml`、`Procfile`
- 这意味着当前发布流程很可能尚未沉淀到仓库内，或者完全依赖平台默认配置与手工操作

## 配置入口

- 当前明确可见的环境配置入口只有 `DATABASE_URL`
- 没有发现根级 `.env*` 文件
- `site/.gitignore` 忽略了 `.env*`，说明运行时环境变量大概率依赖本地或托管平台注入

## 结论

- 当前项目的“集成复杂度”很低，主要是一个本地 SQLite 驱动的内容站。
- 外部依赖更接近“内容来源链接”而不是“运行时 SaaS 编排”。
- 如果后续做 GSD 标准接入，集成面不是主要难点；真正的风险在于测试、发布链路和文档漂移，而不是第三方服务爆炸。
