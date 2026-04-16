# Current State

本文只描述当前代码已经实现什么、验证到什么程度，以及仍然明确存在的边界。

## 本次核对范围

- 已读取：`site/src/app/**`、`site/src/components/**`、`site/src/lib/**`、`site/src/db/**`、`site/src/types/**`、`site/scripts/**`、`shared/**`
- 已对照：`README.md`、`site/README.md`、`docs/**`、`site/src/content/about.md`
- 已确认 seed 基线：`site/src/db/seed-data.ts` 当前定义 18 条样本记录，覆盖 8 个一级分类

## 2026-04-11 已重新执行并通过

- `site/npm run lint`
- `site/npm run typecheck`
- `site/npm run test`
- `site/npm run test:smoke`

`test:smoke` 还实际覆盖了：

- `db:push`
- `db:seed`
- `next build`
- 页面入口 `/`、`/?q=...`、`/category/[category]`、`/skill/[slug]`
- 只读 API `/api/v1/skills`、`/api/v1/skills/[slug]`、`/api/v1/categories`、`/api/v1/content/about`
- 未发布或不存在 slug 的 404 / 404 JSON

## 当前已经实现

### 页面与路由

- 首页 `/`
  - 展示 Hero、热门分类、目录列表
  - 支持 `q`、`type`、`category`、`sort`、`page`
- 分类页 `/category/[category]`
  - 分类由路径固定
  - 页内只支持 `type`、`sort`、`page`
  - 非法分类直接 404
- 详情页 `/skill/[slug]`
  - 只展示 `published` 条目
  - 使用 `generateStaticParams()` 预生成已发布 slug
  - `revalidate = 3600`
- 关于页 `/about`
  - 内容来自 `site/src/content/about.md`

### 只读 API

- `GET /api/v1/skills`
  - 返回目录列表、当前 filters、分页信息和分类统计
- `GET /api/v1/skills/[slug]`
  - 返回单条公开详情
- `GET /api/v1/categories`
  - 返回分类统计和总发布量
- `GET /api/v1/content/about`
  - 返回 about 文档 slug、title、markdown

### 查询、筛选与搜索

- 查询层集中在 `site/src/lib/queries/skills.ts`
- 首页查询参数集中在 `site/src/lib/validation.ts`
- 搜索范围覆盖：
  - `name`
  - `summary`
  - `description`
  - `tags` JSON 文本
- 多词搜索会按空白拆词；每个词都必须命中至少一个字段
- 默认排序是 `updated_desc`
- 默认每页 24 条

### 页面展示

- 统一站点壳层位于 `site/src/app/layout.tsx`
- 顶部导航包含：首页、世界分区、Skill、MCP、关于
- 顶部搜索和 Hero 搜索都提交到 `/`
- 列表卡片与详情页头部都会尝试渲染 `icon`，缺失时回退到类型/分类图标
- 详情页会按数据情况显示：
  - 详细描述
  - 接入与配置
  - 基础信息与目录定位
  - 外部入口
  - 继续探索

### 数据与内容

- 当前核心表只有 `skills`
- 公开只读可见性以 `review_status = "published"` 为硬边界
- `tags`、`supported_platforms` 在 SQLite 中以 JSON 文本存储，查询时再解析为数组
- 默认数据库路径是 `site/data/powerup.db`
- `about` 正文来自 `site/src/content/about.md`

### 开发脚本

- `npm run dev`
  - 会先执行开发预检
  - 自动清理当前项目残留的 Next 开发进程和 `.next/dev/lock`
  - 未设置 `DATABASE_URL` 时，会为默认本地库自动补 schema 与 seed
- `npm run dev:clean`
  - 只执行开发预检清理
- `npm run verify`
  - 串行执行 `lint`、`typecheck`、`test`、`test:smoke`

## 当前边界

- 当前只有只读页面和只读 API，没有后台、账号、投稿审核流或公开写接口
- `site/` 同时承担站点页面和只读 API 提供方两种职责
- 搜索仍是基础字段匹配，没有 FTS5、搜索建议、高亮片段或独立搜索接口
- `frontendv2/` 仍是独立工作区，不是当前正式运行入口
- 仓库内没有可审计的生产部署配置
