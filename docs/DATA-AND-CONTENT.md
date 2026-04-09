# Data And Content

本文说明当前数据模型、公开字段边界、治理字段、枚举、分类，以及 seed 数据在当前实现中的作用范围。

## 核心表

当前唯一需要关注的业务表是 `skills`。

## 字段边界

### 前台公开字段

这些字段由 `site/src/types/skill.ts` 的 `PUBLIC_SKILL_FIELDS` 明确列出，并由查询层映射给前台页面：

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

说明：

- `icon` 仍属于公开字段边界，但本次检查到的列表页和详情页尚未实际渲染图标 UI。
- 详情页外链区当前只实际消费 `doc_url` 和 `github_url`。

### 内部治理字段

这些字段由 `INTERNAL_SKILL_FIELDS` 定义，不应进入前台目录列表或详情公开视图：

- `source_url`
- `source_kind`
- `last_verified_at`
- `review_status`
- `created_at`

## 类型与枚举

### 条目类型

- `skill`
- `mcp_server`

前台展示标签固定映射为：

- `skill` -> `Skill`
- `mcp_server` -> `MCP`

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

## 分类枚举

当前一级分类 slug 固定为十个值：

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

当前 seed 基线实际覆盖其中 8 个分类，未覆盖：

- `business-finance`
- `security-ops`

## 可见性规则

`published` 是当前前台可见性的硬边界。

- 列表：`listSkills()` 只查询 `review_status = "published"`
- 详情：`getSkillBySlug()` 只查询 `published`
- 分类计数：`getCategoryCounts()` 只统计 `published`

这意味着：

- `draft`
- `reviewed`
- `archived`

即使存在于库中，也不会进入首页、分类页、详情页或搜索结果。

## JSON 文本数组

以下两个字段在 SQLite 中不是原生数组，而是文本列：

- `tags`
- `supported_platforms`

当前实现方式：

- 写入时：`seed.ts` 用 `JSON.stringify()` 序列化
- 读取时：`queries/skills.ts` 用 `parseJsonTextArray()` 解码
- 解码失败时：回退为空数组，而不是抛出前台错误

## Seed 边界

### 当前 seed 文件承担什么

- `site/src/db/seed-data.ts` 是当前样本内容基线
- `site/src/db/seed.ts` 负责把样本数据写入 SQLite，并按 `slug` 做 upsert
- 未显式给出 `review_status` 的 seed 记录，会在 seed 归一化时默认落成 `published`

### 当前可核对的事实

- seed 文件定义了 18 条样本记录
- 类型同时覆盖 `skill` 与 `mcp_server`
- 按当前 seed 归一化规则，这 18 条样本默认都会进入 `published`
- 当前仓库不要求预先存在 `site/data/powerup.db`；如未设置 `DATABASE_URL`，运行时和数据库脚本会按默认路径创建它

### 不要误判的边界

- `site/data/powerup.db` 是本地运行产物，不是版本化内容真源
- 持久化字段边界和样本内容基线的真源仍在 `site/src/db/schema.ts` 与 `site/src/db/seed-data.ts`
- 当前没有 CMS、后台编辑器或在线内容写入流程
