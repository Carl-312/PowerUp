# Data And Content

本文说明当前数据模型、公开字段边界、内容来源和 seed 基线。

## 核心表

当前唯一业务表是 `skills`。

## 前台公开字段

这些字段会进入页面或只读 API：

- `name`
- `slug`
- `type`
- `icon`
- `summary`
- `description`
- `category`
- `tags`
- `author`
- `license`
- `github_url`
- `doc_url`
- `install_guide`
- `config_example`
- `supported_platforms`
- `updated_at`

### 当前实际展示方式

- 列表卡片会尝试渲染 `icon`
- 详情页头部也会尝试渲染 `icon`
- 如果 `icon` 为空，会回退到类型 / 分类对应的 fallback 图标
- 外部链接当前只公开：
  - `doc_url`
  - `github_url`

## 内部治理字段

这些字段仍属于内部治理层，不进入前台公开视图：

- `source_url`
- `source_kind`
- `last_verified_at`
- `review_status`
- `created_at`

## 类型与枚举

### 条目类型

- `skill`
- `mcp_server`

### review_status

- `draft`
- `reviewed`
- `published`
- `archived`

### source_kind

- `official_docs`
- `github_repo`
- `vendor_site`
- `community_directory`

### 分类枚举

当前一级分类固定为 10 个 slug：

- `developer-tools`
- `data-analytics`
- `communication-collaboration`
- `content-writing`
- `search-information`
- `business-finance`
- `design-media`
- `security-ops`
- `files-storage`
- `other`

当前 seed 实际覆盖 8 个分类，未覆盖：

- `business-finance`
- `security-ops`

## 可见性规则

`published` 是当前页面和只读 API 的统一公开边界：

- 列表：`listSkills()` 只查 `published`
- 详情：`getSkillBySlug()` 只查 `published`
- 分类计数：`getCategoryCounts()` 只统计 `published`

因此 `draft`、`reviewed`、`archived` 即使在库中存在，也不会进入首页、分类页、详情页或公开 API 结果。

## JSON 文本字段

以下字段在 SQLite 中以文本保存：

- `tags`
- `supported_platforms`

当前实现方式：

- seed 写入时使用 `JSON.stringify()`
- 查询读取时在 `queries/skills.ts` 中解析回数组
- 解析失败时回退为空数组，不直接把错误抛给前台

## Seed 与内容来源

- `site/src/db/seed-data.ts`：当前样本内容基线
- `site/src/db/seed.ts`：按 `slug` upsert 到 SQLite
- `site/src/content/about.md`：关于页与 `/api/v1/content/about` 的正文来源

2026-04-11 本次核对确认：

- seed 记录数：18
- 当前 seed 覆盖分类数：8
- `npm run test:smoke` 中的 `db:seed` 可正常写入这些记录

## 当前边界

- `site/data/powerup.db` 是运行产物，不是版本化真源
- 当前没有 CMS、后台编辑器或在线写入流程
- 内容真源仍是 `schema.ts`、`seed-data.ts` 和 `content/about.md`
