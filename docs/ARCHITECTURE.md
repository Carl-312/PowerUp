# Architecture

当前仓库是“仓库根协调层 + `site/` 运行根 + `frontendv2/` 独立前端工作区”的结构，不是单一应用目录。

## 目录职责

- `site/`
  - 当前正式运行入口
  - Next.js 页面
  - 只读 API
  - SQLite/Drizzle 数据层
- `frontendv2/`
  - 独立前端实验工作区
  - 通过 `/api/v1/**` 消费数据
- `shared/`
  - 分类、类型和 API contract
- `docs/`
  - 当前实现说明

## `site/` 内的主分层

- `src/app/**`
  - App Router 页面与 Route Handlers
- `src/components/**`
  - 页面壳层、目录卡片、详情面板、搜索表单、导航等展示组件
- `src/lib/validation.ts`
  - URL 参数归一化与边界收口
- `src/lib/queries/skills.ts`
  - 目录查询、详情读取、分类统计、公开可见性规则
- `src/lib/api/**`
  - API envelope 与 DTO 序列化
- `src/lib/content/about.ts`
  - About Markdown 读取
- `src/db/**`
  - SQLite 连接、schema、seed

## 页面链路

### 首页与分类页

1. 页面读取 `searchParams` / `params`
2. `validation.ts` 归一化筛选条件
3. `queries/skills.ts` 组装 where、排序和分页
4. Drizzle 读取 SQLite
5. 结果交给 `SkillDirectory`、`SiteSearchForm` 等组件渲染

### 详情页

1. 页面读取 `params.slug`
2. `getSkillBySlug()` 只查 `published`
3. 页面头部由 `SkillDetailHeader` 渲染
4. 正文与接入信息由 `MarkdownRenderer` / `CodeBlock` / `ContentPanel` 渲染

### 关于页

1. `readAboutContent()` 读取 `src/content/about.md`
2. `MarkdownRenderer` 输出正文
3. 不依赖数据库

## API 链路

1. Route Handler 读取 URL 参数或路径参数
2. 复用 `validation.ts` 与 `queries/skills.ts`
3. 通过 `lib/api/serializers.ts` 转成共享 contract 对应的 payload
4. 统一由 `lib/api/response.ts` 包装为 JSON success / error envelope

当前只读 API 包括：

- `/api/v1/skills`
- `/api/v1/skills/[slug]`
- `/api/v1/categories`
- `/api/v1/content/about`

## 数据层

- `db/index.ts`
  - 解析 `DATABASE_URL`
  - 默认回退 `data/powerup.db`
  - 自动确保目录存在
  - 开启 SQLite WAL
- `db/schema.ts`
  - 定义 `skills` 表与索引
- `db/seed.ts`
  - 按 `slug` upsert seed
- `db/seed-data.ts`
  - 当前样本内容基线

## 当前架构结论

- `site/` 不是纯页面站点，已经同时承担只读 API 提供方
- `frontendv2/` 是独立消费端，不应反向耦合 `site/src/db/**` 或 `site/src/lib/queries/**`
- 当前最稳定的边界是：
  - 页面层负责路由语义和 UI
  - 校验层负责 URL 输入
  - 查询层负责读模型与可见性规则
  - API 层负责公开 JSON 契约
  - 数据层负责 SQLite/Drizzle
