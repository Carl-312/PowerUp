# PowerUp V1 Walkthrough（历史归档）

> 本文是更早版本的 V1 完整实施说明，已在 2026-04-08 的“阶段一：软归档”中降级为历史文档。
> 它保留原始任务卡、目录目标和实施顺序，便于回溯当时的规划思路，
> 但不再作为当前实现真源，也不再作为默认执行入口。
>
> 当前应优先阅读：
> - `../AGENTS.md`
> - `../docs/README.md`
> - `../docs/CURRENT-STATE.md`
> - `../docs/ARCHITECTURE.md`
> - `../docs/DEVELOPMENT.md`
> - `../docs/DRIFT-AND-SOURCES-OF-TRUTH.md`

## 文档目的

- 本文保留了 PowerUp V1 最早期的完整实施说明，用来记录最初如何把 `specs-v1/PRD.md` 展开成任务。
- 本文默认面向需要回溯历史规划的人，而不是面向当前实现维护。
- 本文保留原任务 ID、章节骨架与任务卡顺序，方便回看历史决策链路。
- 本文后续出现的“当前 V1 注记 / V2 对齐说明 / 当前不做”，都属于历史时期的回写痕迹，不应再被理解为当前仓库状态说明。
- 当前真实实现和后续开发起点不在本文，而在 `docs/**`、真实代码和 `.planning/ROADMAP.md`。

---

## 历史使用说明

- 下文的目录树、任务卡、命令示例和目标结构，很多是当时的规划目标，不等于当前仓库实际结构。
- 如果本文与当前代码、`docs/**`、`specs-v1/terms-and-directory-contract.md` 或 `specs-v1/routing-render-search-contract.md` 冲突，以当前代码和这些当前文档为准。

## 1. 锁定决策

### 1.1 工作区与目录

- 文档根目录：`E:\cursorproject\PowerUp`
- 新规格目录：`E:\cursorproject\PowerUp\specs-v1`
- 未来代码根目录：`E:\cursorproject\PowerUp\site`
- `specs-v1/terms-and-directory-contract.md` 是 T0-01 的单一真源，用来冻结术语、目录职责、类型枚举与分类 slug。
- 原始文档只读，不改名、不补跳转说明、不插入废弃提示。

### 1.2 技术基线

- 运行时：Node.js 20.9+
- 包管理器：`npm`
- 前端框架：Next.js App Router
- 样式：Tailwind CSS + shadcn/ui
- 数据库：SQLite
- ORM：Drizzle ORM
- Markdown：`react-markdown` + `remark-gfm`
- 代码高亮：`shiki`（当前 V1 注记：依赖可保留，但详情页首版只要求 `react-markdown` + 可读的原生 `pre/code`，不把 Shiki 效果作为阻塞项）
- 参数校验：`zod`

### 1.3 渲染与数据流

- `specs-v1/routing-render-search-contract.md` 是 T0-02 的单一真源，用来冻结路由职责、渲染模式、页面数据流和搜索流转。
- 页面组件优先直接调用服务端查询层，不通过内部 HTTP API 再绕一层。
- 当前 V1 注记：`GET /api/skills`、`GET /api/skills/[slug]`、`GET /api/categories`、`GET /api/skills/search` 均不作为首版阻塞项；如后续出现外部复用或搜索增强需求，再单独补。
- 首页 `/` 使用 `searchParams` 驱动筛选和分页，因此按动态页面处理。
- 分类页 `/category/[category]` 同样读取 `searchParams`，按动态页面处理。
- 详情页 `/skill/[slug]` 可以使用 `generateStaticParams` 生成已知 slug，并设置定时再验证。

### 1.4 搜索策略

- 当前 V1 搜索先保留基础 SQLite 字段匹配，不把 FTS5、触发器、高亮片段作为首版前置条件。
- 搜索范围：`name`、`summary`、`description`、`tags` JSON 文本。
- 顶部搜索框和首页 Hero 搜索框统一使用普通 GET 表单提交到 `/?q=关键词`。
- 搜索完整结果复用首页列表态，不额外创建 `/search` 页面。
- 当前不做实时搜索建议、防抖、键盘建议面板与 `/api/skills/search`。

### 1.5 迁移策略

- 采用 Drizzle code-first 流程。
- 当前 V1 先使用本地 SQLite + `db:push` + `db:seed` 跑通站点与数据闭环。
- `drizzle-kit generate`、`drizzle-kit migrate` 与自定义 FTS5 SQL migration 保留为后续增强，不作为当前首版阻塞链路。

### 1.6 内容策略

- 前台仅显示 `review_status = published` 的记录。
- V1 的内容源事实表以 `seed-data.ts` 为初始录入基线，再通过 seed 脚本导入 SQLite。
- 每条发布记录必须带 `source_url`、`source_kind`、`last_verified_at`。

### 1.7 设计基线

- V1 以浅色主题为默认交付，不把深色模式作为必做项。
- 风格目标是“信息密度适中、通俗优先、技术细节后置”。
- 首页和分类页复用同一套列表骨架，避免样式分叉。

---

## 2. 目录约定

以下目录树以 `E:\cursorproject\PowerUp\site` 为代码根目录：

- 当前 V1 注记：以下目录树保留完整版目标结构，首版不要求一次性落齐 `src/app/api/**`、`src/app/robots.ts`、`src/app/sitemap.ts`、`Dockerfile`、`docker-compose.yml`、`Caddyfile`；当前 MVP 以页面、查询层和基础 metadata 为主。

```text
site/
├── src/
│   ├── app/
│   │   ├── about/page.tsx
│   │   ├── api/
│   │   │   ├── categories/route.ts
│   │   │   └── skills/
│   │   │       ├── route.ts
│   │   │       ├── search/route.ts
│   │   │       └── [slug]/route.ts
│   │   ├── category/[category]/page.tsx
│   │   ├── skill/[slug]/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── search/
│   │   ├── skill/
│   │   └── ui/
│   ├── content/
│   │   └── about.md
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   ├── seed-data.ts
│   │   └── seed.ts
│   ├── lib/
│   │   ├── categories.ts
│   │   ├── queries/
│   │   │   └── skills.ts
│   │   ├── search.ts
│   │   └── validation.ts
│   └── types/
│       └── skill.ts
├── data/
│   └── powerup.db
├── drizzle/
├── public/
├── drizzle.config.ts
├── Dockerfile
├── docker-compose.yml
├── Caddyfile
└── package.json
```

---

## 3. 任务卡总览

| 任务 ID | 名称 | 依赖 | 主要产出 | 关联验收 |
| --- | --- | --- | --- | --- |
| `T0-01` | 术语与目录约定 | 无 | 路径、命名、枚举约定 | `AC-CONTENT-04` |
| `T0-02` | 路由、渲染与搜索决策定稿 | `T0-01` | 数据流和渲染策略定稿 | `AC-HOME-03`, `AC-SEARCH-04`, `AC-DETAIL-05`, `AC-CAT-04` |
| `T1-01` | 项目脚手架 | `T0-02` | 可运行 Next.js 项目 | `AC-NFR-01` |
| `T1-02` | UI 与基础依赖 | `T1-01` | UI 组件基础与通用依赖 | `AC-NFR-03`, `AC-NFR-04` |
| `T2-01` | Schema 与类型 | `T1-02` | 数据表、类型、枚举 | `AC-CONTENT-01`, `AC-CONTENT-02`, `AC-CONTENT-04` |
| `T2-02` | 种子数据 | `T2-01` | 初始内容样本和 seed 脚本 | `AC-HOME-01`, `AC-CONTENT-01` |
| `T2-03` | 搜索索引 | `T2-01` | FTS5 表、触发器、搜索片段（后续增强，非当前 V1 阻塞） | `AC-SEARCH-02`, `AC-SEARCH-03` |
| `T3-01` | 查询层 | `T2-02` | 服务端基础查询函数（当前先做基础查询层） | `AC-HOME-01`, `AC-DETAIL-05`, `AC-CAT-01` |
| `T3-02` | API 暴露 | `T3-01` | 四个公开接口（当前不作为 V1 必做） | `AC-SEARCH-03`, `AC-SEARCH-05` |
| `T4-01` | 全局布局 | `T1-02`, `T3-01` | Header、Footer、全局壳层 | `AC-NFR-01`, `AC-NFR-04` |
| `T4-02` | 首页列表 | `T4-01`, `T3-01` | 首页列表态、筛选、分页 | `AC-HOME-01` 至 `AC-HOME-05` |
| `T4-03` | 详情页 | `T4-01`, `T3-01` | 详情页四个信息区 | `AC-DETAIL-01` 至 `AC-DETAIL-05` |
| `T4-04` | 分类页 | `T4-02` | 分类页与分类校验 | `AC-CAT-01` 至 `AC-CAT-04` |
| `T4-05` | 关于页 | `T4-01` | 静态关于页 | `AC-ABOUT-01`, `AC-ABOUT-02` |
| `T4-06` | 搜索交互 | `T3-02`, `T4-01`, `T4-02` | 搜索建议、键盘操作、回车跳转（后续增强，非当前 V1 必做） | `AC-SEARCH-01` 至 `AC-SEARCH-05`, `AC-NFR-04` |
| `T5-01` | SEO 与结构化数据 | `T4-02`, `T4-03`, `T4-05` | 基础 metadata；`sitemap`、`robots`、JSON-LD 为后续增强 | `AC-NFR-03` |
| `T5-02` | 构建、部署与发布检查 | `T5-01` | 生产构建与发布检查；Docker、Caddy 为后续增强 | `AC-NFR-01`, `AC-NFR-02`, `AC-NFR-03` |

---

## 4. 任务卡

### T0-01 术语与目录约定

- 目标：
  锁定命名、路径、枚举和旧文档只读约束，避免后续实现中不断返工。
- 前置条件：
  无。
- 输入：
  `specs-v1/PRD.md`、历史 `PRD.md`、历史 `walkthrough.md`（若存在）。
- 锁定决策：
  代码根目录固定为 `site/`；分类 slug 使用 PRD 中的十个枚举；类型枚举使用 `mcp_server` 与 `skill`。
- 执行步骤：
  1. 统一术语，前台展示叫 “Skill / MCP”，内部数据类型沿用 `skill` / `mcp_server`。
  2. 统一目录职责，`specs-v1` 放文档，`site/` 放代码。
  3. 写出分类 slug 常量和展示标签映射。
- 涉及文件/命令：
  - `specs-v1/terms-and-directory-contract.md`
  - `specs-v1/PRD.md`
  - 后续代码落地目标：`site/src/lib/categories.ts`、`site/src/types/skill.ts`
- 产出物：
  命名常量、类型枚举、分类映射，以及一份可直接映射到代码的实现契约文档。
- 完成定义：
  后续任务不再出现旧项目名、歧义路径或重复分类定义。
- 验证方式：
  全文搜索项目名和分类 slug，确认只有 `PowerUp` 和一套枚举。
- 关联验收：
  `AC-CONTENT-04`
- 常见失败点：
  - 继续沿用旧项目名。
  - 把展示名称直接拿来做 URL slug。

### T0-02 路由、渲染与搜索决策定稿

- 目标：
  在写任何页面前锁定渲染模型和搜索流转方式。
- 前置条件：
  `T0-01`
- 输入：
  `specs-v1/PRD.md`
- 锁定决策：
  首页与分类页读取 `searchParams`，按动态页面处理；详情页使用 `generateStaticParams` + `revalidate`；完整搜索结果复用首页，不建 `/search`。
- 执行步骤：
  1. 写出 `/`、`/skill/[slug]`、`/category/[category]`、`/about` 的职责边界。
  2. 确认页面直接走查询层，非必要不通过内部 API。
  3. 锁定当前 V1 搜索统一提交到 `/?q=...`，不把 `/api/skills/search` 与实时 suggestions 作为首版前置条件。
- 涉及文件/命令：
  - `specs-v1/routing-render-search-contract.md`
  - `specs-v1/PRD.md`
  - 后续代码落地目标：`site/src/app/page.tsx`、`site/src/app/skill/[slug]/page.tsx`、`site/src/app/category/[category]/page.tsx`
- 产出物：
  固定的数据流、路由职责与搜索流转契约。
- 完成定义：
  实现说明中不再出现首页 `generateStaticParams`、独立 `/search` 页面或“页面必须先走内部 API”之类的冲突。
- 验证方式：
  检查实现文档和代码注释，确认每个路由职责唯一。
- 关联验收：
  `AC-HOME-03`, `AC-SEARCH-04`, `AC-DETAIL-05`, `AC-CAT-04`
- 常见失败点：
  - 页面内部再请求自己站点 API。
  - 新增独立搜索结果页，导致与 PRD 脱节。

### T1-01 项目脚手架

- 目标：
  创建可运行的 Next.js App Router 项目。
- 前置条件：
  `T0-02`
- 输入：
  本文档中的目录约定。
- 锁定决策：
  不在 `PowerUp` 根目录直接初始化 Next.js 项目，而是在 `site/` 子目录初始化。
- 执行步骤：
  1. 在 `E:\cursorproject\PowerUp` 下创建 `site/` 项目。
  2. 启用 TypeScript、ESLint、Tailwind、App Router、`src/` 目录和默认别名。
  3. 保留文档目录，不把 `specs-v1` 混入 `site/`。
- 涉及文件/命令：
  ```bash
  cd E:\cursorproject\PowerUp
  npx create-next-app@latest site --ts --eslint --tailwind --app --src-dir --use-npm --import-alias "@/*" --yes
  ```
- 产出物：
  `site/package.json`、`site/src/app`、基础开发脚本。
- 完成定义：
  `npm run dev` 可启动默认 Next.js 页面。
- 验证方式：
  运行 `npm run dev`，访问 `http://localhost:3000`。
- 关联验收：
  `AC-NFR-01`
- 常见失败点：
  - 在非空根目录直接初始化导致脚手架失败。
  - 把未来代码和当前文档混在同一个根目录结构里。

### T1-02 UI 与基础依赖

- 目标：
  安装数据库、Markdown、代码高亮、校验和 UI 依赖，为后续任务扫清基础设施。
- 前置条件：
  `T1-01`
- 输入：
  技术基线。
- 锁定决策：
  采用 `shadcn@latest` CLI 初始化现有 Next.js 项目；深色模式不纳入必做。
- 执行步骤：
  1. 安装业务依赖和开发依赖。
  2. 初始化 shadcn/ui。
  3. 添加首批基础组件。
  4. 创建空目录骨架。
- 涉及文件/命令：
  ```bash
  cd E:\cursorproject\PowerUp\site
  npm install drizzle-orm better-sqlite3 react-markdown remark-gfm shiki zod
  npm install -D drizzle-kit @types/better-sqlite3 tsx
  npx shadcn@latest init -t next -y
  npx shadcn@latest add button card badge input select tabs separator breadcrumb skeleton sheet -y
  ```
- 产出物：
  `components.json`、基础 UI 组件、依赖清单。
- 完成定义：
  项目能正常编译，`src/components/ui` 中已有基础组件。
- 验证方式：
  运行 `npm run build`，确认依赖安装正确。
- 关联验收：
  `AC-NFR-03`, `AC-NFR-04`
- 常见失败点：
  - 继续使用旧的 `shadcn-ui@latest` 包名。
  - 一开始就把 `next-themes`、Storybook 作为阻塞项。

### T2-01 Schema 与类型

- 目标：
  建立符合 PRD 的数据结构和共享类型。
- 前置条件：
  `T1-02`
- 输入：
  `specs-v1/PRD.md` 第 6、7 章。
- 锁定决策：
  `tags` 与 `supported_platforms` 以 JSON 文本存储；`updated_at` 与 `last_verified_at` 使用 Unix 时间戳整数。
- 执行步骤：
  1. 在 `src/db/schema.ts` 定义 `skills` 表。
  2. 为 `slug` 建唯一约束。
  3. 为 `type`、`category`、`review_status`、`updated_at` 建索引。
  4. 在 `src/types/skill.ts` 定义 `SkillRecord`、`SkillListItem`、`SearchResultItem` 等共享类型。
  5. 在 `drizzle.config.ts` 配置 SQLite 连接和 `drizzle/` 输出目录。
- 涉及文件/命令：
  - `drizzle.config.ts`
  - `src/db/schema.ts`
  - `src/db/index.ts`
  - `src/types/skill.ts`
- 产出物：
  数据表声明、类型声明、数据库连接封装。
- 完成定义：
  Schema 完整覆盖 PRD 公共字段和内部治理字段。
- 验证方式：
  运行 TypeScript 检查，确认类型引用通过。
- 关联验收：
  `AC-CONTENT-01`, `AC-CONTENT-02`, `AC-CONTENT-04`
- 常见失败点：
  - 漏掉内部治理字段。
  - 用展示文案替代枚举值。

### T2-02 种子数据

- 目标：
  用一组可信的样本数据跑通列表、详情和搜索。
- 前置条件：
  `T2-01`
- 输入：
  PRD 的收录标准与字段规范。
- 锁定决策：
  开发期至少准备 18 条样本，覆盖 6 个以上一级分类，并且全部带有效来源字段。
- 执行步骤：
  1. 在 `src/db/seed-data.ts` 维护初始记录数组。
  2. 在 `src/db/seed.ts` 中实现幂等导入。
  3. 所有样本默认 `review_status = published`。
  4. 在 `package.json` 增加数据库脚本。
- 涉及文件/命令：
  - `src/db/seed-data.ts`
  - `src/db/seed.ts`
  - `package.json`
  - `npm run db:seed`
- 产出物：
  样本数据、seed 脚本、数据库脚本命令。
- 完成定义：
  本地数据库可导入并重复执行 seed，不产生重复数据。
- 验证方式：
  运行 `npm run db:seed` 后查询 `skills` 表记录数和分类覆盖。
- 关联验收：
  `AC-HOME-01`, `AC-CONTENT-01`
- 常见失败点：
  - 样本条目缺 `source_url` 或 `last_verified_at`。
  - 导入脚本不幂等，重复执行后产生脏数据。

### T2-03 搜索索引

- 目标：
  建立搜索索引和高亮片段能力。
- 当前 V1 注记：
  当前首版搜索只保留基础 `/?q=` 结果态；本任务中的 FTS5、触发器、高亮片段全部降级为后续 backlog，`T3-01` 不再依赖本任务启动。
- 前置条件：
  `T2-01`
- 输入：
  搜索范围与建议行为定义。
- 锁定决策：
  使用独立 `skills_fts` 虚拟表和触发器同步，不把 FTS 逻辑揉进普通表。
- 执行步骤：
  1. 生成初始迁移。
  2. 用自定义 SQL migration 创建 `skills_fts`。
  3. 建立 insert、update、delete 触发器。
  4. 统一 `tags` 预处理为可搜索文本。
- 涉及文件/命令：
  - `drizzle/*/migration.sql`
  - `npx drizzle-kit generate --name init`
  - `npx drizzle-kit generate --custom --name skills-fts`
  - `npx drizzle-kit migrate`
- 产出物：
  FTS5 表、触发器、自定义 migration。
- 完成定义：
  更新 `skills` 表后，FTS 检索结果同步变化。
- 验证方式：
  直接执行 FTS 查询，确认能返回匹配项和高亮片段。
- 关联验收：
  `AC-SEARCH-02`, `AC-SEARCH-03`
- 常见失败点：
  - 只建 FTS 表，不建同步触发器。
  - 把 `tags` JSON 直接塞进 FTS，导致搜索质量差。

### T3-01 查询层

- 目标：
  封装页面与 API 共用的服务端查询函数。
- 前置条件：
  `T2-02`
- 输入：
  PRD 路由、筛选和前台字段边界。
- 锁定决策：
  查询层只返回公开字段；内部治理字段由管理脚本或未来后台使用，不直接暴露给前台。
- 当前 V1 注记：
  先交付页面直接可用的基础查询层，搜索先使用普通字段匹配，不等待 `T2-03`。
- 执行步骤：
  1. 实现 `listSkills(filters)`。
  2. 实现 `getSkillBySlug(slug)`。
  3. 实现 `getCategoryCounts()`。
  4. 当前 V1 先不实现 `searchSkillSuggestions(q, limit)`；如后续重启实时建议，再在查询层补齐对应函数。
  5. 统一把 JSON 文本字段转换为数组。
- 涉及文件/命令：
  - `src/lib/queries/skills.ts`
  - `src/lib/search.ts`（如后续搜索增强需要再补）
  - `src/lib/validation.ts`
- 产出物：
  查询层函数与输入解析器。
- 完成定义：
  页面和 API 可以只依赖查询层，不再写重复 SQL。
- 验证方式：
  用临时脚本或单元测试调用查询函数，检查筛选、分页、404 场景。
- 关联验收：
  `AC-HOME-01`, `AC-DETAIL-05`, `AC-CAT-01`
- 常见失败点：
  - 查询层直接返回数据库原始结构，导致页面层再做大量转换。
  - 忘记过滤 `review_status != published`。

### T3-02 API 暴露

- 目标：
  如未来需要外部复用，再暴露约定好的四个公开接口。
- 前置条件：
  `T3-01`
- 当前 V1 注记：
  本任务不作为首版阻塞项；只有在明确出现外部复用、调试接口或前端增强需求时才启动。
- 输入：
  查询层函数和 PRD 查询参数约定。
- 锁定决策：
  API 统一返回 JSON 对象，不直接返回裸数组；参数校验统一使用 `zod`。
- 执行步骤：
  1. 实现 `GET /api/skills`。
  2. 实现 `GET /api/skills/[slug]`。
  3. 实现 `GET /api/skills/search`。
  4. 实现 `GET /api/categories`。
  5. 统一错误码，参数错误返回 400，不存在返回 404。
- 涉及文件/命令：
  - `src/app/api/skills/route.ts`
  - `src/app/api/skills/[slug]/route.ts`
  - `src/app/api/skills/search/route.ts`
  - `src/app/api/categories/route.ts`
- 产出物：
  四个 route handler。
- 完成定义：
  若启动本任务，所有接口可以独立调试，返回结构稳定。
- 验证方式：
  若启动本任务，使用浏览器、`curl` 或 API client 请求四个端点。
- 关联验收：
  `AC-SEARCH-03`, `AC-SEARCH-05`
- 常见失败点：
  - 把搜索端点继续塞进 `/api/skills`。
  - API 返回数据库内部字段。

### T4-01 全局布局

- 目标：
  建立站点壳层和统一导航。
- 前置条件：
  `T1-02`, `T3-01`
- 输入：
  首页、分类页、详情页、关于页的导航需求。
- 锁定决策：
  Root layout 不读取 `searchParams`；搜索交互由独立客户端组件处理。
- 执行步骤：
  1. 实现 Header，包含 Logo、站点名、主导航、搜索入口。
  2. 实现 Footer，包含项目简介、联系入口、版权占位。
  3. 设置主内容区最大宽度和基础留白。
  4. 增加移动端导航抽屉。
- 涉及文件/命令：
  - `src/app/layout.tsx`
  - `src/components/layout/header.tsx`
  - `src/components/layout/footer.tsx`
  - `src/app/globals.css`
- 产出物：
  站点统一壳层。
- 完成定义：
  四个公开页面共享统一头尾和基础排版。
- 验证方式：
  手动访问各页面，确认导航一致、移动端可达。
- 关联验收：
  `AC-NFR-01`, `AC-NFR-04`
- 常见失败点：
  - 在 layout 里直接读查询参数。
  - Header 与首页 Hero 各自维护不同搜索逻辑。

### T4-02 首页列表

- 目标：
  实现首页 Hero、列表、筛选、排序、分页和空状态。
- 前置条件：
  `T4-01`, `T3-01`
- 输入：
  首页功能需求与 URL 参数契约。
- 锁定决策：
  分页采用传统页码分页，不做“Load more”。
- 执行步骤：
  1. 用 `searchParams` 解析筛选条件。
  2. 调用 `listSkills(filters)`。
  3. 渲染 Hero、筛选器、排序器、卡片网格、分页。
  4. 对空结果提供“清空筛选”入口。
- 涉及文件/命令：
  - `src/app/page.tsx`
  - `src/components/skill/skill-card.tsx`
  - `src/components/skill/skill-grid.tsx`
  - `src/components/layout/filter-bar.tsx`
  - `src/components/layout/pagination.tsx`
- 产出物：
  首页完整列表态。
- 完成定义：
  用户可在首页完成默认浏览、筛选、排序、搜索结果浏览和分页。
- 验证方式：
  手动测试 URL 参数组合和刷新回显。
- 关联验收：
  `AC-HOME-01`, `AC-HOME-02`, `AC-HOME-03`, `AC-HOME-04`, `AC-HOME-05`
- 常见失败点：
  - 只在客户端过滤，刷新后状态丢失。
  - 结果为空时只显示空白页。

### T4-03 详情页

- 目标：
  实现四段式详情页和缺失 slug 的 404。
- 前置条件：
  `T4-01`, `T3-01`
- 输入：
  PRD 详情页结构。
- 锁定决策：
  详情页只展示公开字段；无值区块不占位；详情页加入定时再验证。
- 执行步骤：
  1. 用 `params.slug` 获取条目。
  2. 条目不存在或未发布时返回 `notFound()`。
  3. 渲染基础信息区、详细描述区、集成信息区、外部链接区。
  4. 使用 `react-markdown` 渲染 Markdown，并提供可读的原生 `pre/code`；`shiki` 效果留作后续增强。
  5. 生成 `generateStaticParams` 以覆盖已知 slug。
- 涉及文件/命令：
  - `src/app/skill/[slug]/page.tsx`
  - `src/components/skill/skill-detail-header.tsx`
  - `src/components/skill/markdown-renderer.tsx`
  - `src/components/skill/code-block.tsx`
- 产出物：
  详情页与相关渲染组件。
- 完成定义：
  用户能够看懂单个条目的用途、场景、接入方式和外部来源。
- 验证方式：
  手动访问存在和不存在的 slug，检查区块显示和 404。
- 关联验收：
  `AC-DETAIL-01`, `AC-DETAIL-02`, `AC-DETAIL-03`, `AC-DETAIL-04`, `AC-DETAIL-05`
- 常见失败点：
  - 无值字段仍然渲染空标题块。
  - 详情页暴露内部治理字段。

### T4-04 分类页

- 目标：
  实现固定分类上下文下的列表页。
- 前置条件：
  `T4-02`
- 输入：
  分类 slug 映射表。
- 锁定决策：
  分类页只允许切换 `type`、`sort`、`page`；分类本身由路径锁定。
- 执行步骤：
  1. 校验 `params.category` 是否为合法 slug。
  2. 调用列表查询并强制注入当前分类。
  3. 复用首页卡片和分页组件。
  4. 输出分类标题、emoji 和条目数量。
- 涉及文件/命令：
  - `src/app/category/[category]/page.tsx`
  - `src/lib/categories.ts`
- 产出物：
  分类页。
- 完成定义：
  分类页行为和首页一致，但分类上下文固定。
- 验证方式：
  测试合法和非法分类 slug。
- 关联验收：
  `AC-CAT-01`, `AC-CAT-02`, `AC-CAT-03`, `AC-CAT-04`
- 常见失败点：
  - 在分类页仍允许自由切换其他分类。
  - 分类标题与 slug 映射不一致。

### T4-05 关于页

- 目标：
  提供一个稳定、可索引的静态说明页。
- 前置条件：
  `T4-01`
- 输入：
  PRD 中的产品概述、V1 边界和开放问题。
- 锁定决策：
  关于页文案源放在 `src/content/about.md`，页面负责渲染，不内嵌大段字符串。
- 执行步骤：
  1. 编写 about 文案。
  2. 创建 `/about` 页面读取并渲染内容。
  3. 增加联系与贡献说明占位。
- 涉及文件/命令：
  - `src/content/about.md`
  - `src/app/about/page.tsx`
- 产出物：
  静态关于页。
- 完成定义：
  页面能独立访问，并正确说明 V1 当前边界。
- 验证方式：
  手动访问 `/about`，检查 SEO 元信息和内容一致性。
- 关联验收：
  `AC-ABOUT-01`, `AC-ABOUT-02`
- 常见失败点：
  - 关于页内容与 PRD 的 V1 范围冲突。
  - 直接把联系信息硬编码在多个组件中。

### T4-06 搜索交互

- 目标：
  实现即时建议、键盘交互和回车跳转。
- 当前 V1 注记：
  本任务整体降级为后续增强；当前首版只要求顶部搜索框和首页 Hero 使用普通 GET 表单提交到 `/?q=` 结果态。
- 前置条件：
  `T3-02`, `T4-01`, `T4-02`
- 输入：
  搜索行为定义。
- 锁定决策：
  搜索建议组件为客户端组件；完整结果仍交给首页服务端列表处理。
- 执行步骤：
  1. 创建客户端搜索栏组件。
  2. 对输入做 300ms 防抖。
  3. 调用 `/api/skills/search?q=...&limit=8`。
  4. 支持键盘上下选择、回车确认、Escape 关闭。
  5. 回车或点击结果后跳转详情或 `/?q=...`。
- 涉及文件/命令：
  - `src/components/search/search-bar.tsx`
  - `src/components/search/search-suggestions.tsx`
  - `src/app/api/skills/search/route.ts`
- 产出物：
  搜索栏和建议面板。
- 完成定义：
  搜索从输入、建议、跳转到结果页全流程打通。
- 验证方式：
  手动测试键盘、鼠标、空搜索词、无结果和网络失败场景。
- 关联验收：
  `AC-SEARCH-01`, `AC-SEARCH-02`, `AC-SEARCH-03`, `AC-SEARCH-04`, `AC-SEARCH-05`, `AC-NFR-04`
- 常见失败点：
  - 每次按键都立即请求，导致抖动。
  - 搜索建议与首页结果使用不同字段集合。

### T5-01 SEO 与结构化数据

- 目标：
  补齐首页、分类页、详情页和关于页的基础可抓取元信息。
- 前置条件：
  `T4-02`, `T4-03`, `T4-05`
- 当前 V1 注记：
  当前只要求基础 metadata，不把 `sitemap`、`robots`、JSON-LD 作为首版阻塞项。
- 输入：
  PRD 的 SEO 要求。
- 锁定决策：
  使用 Next 内建 metadata API，不额外引入 `next-sitemap`；`app/sitemap.ts`、`app/robots.ts` 与 JSON-LD 留作后续 SEO 硬化。
- 执行步骤：
  1. 为所有公开页面写 `metadata`。
  2. 基于 `NEXT_PUBLIC_SITE_URL` 生成基础 canonical 和 Open Graph。
  3. 若后续进入 SEO 硬化，再补 `sitemap`、`robots` 和详情页 JSON-LD。
- 涉及文件/命令：
  - `src/app/layout.tsx`
  - `src/app/sitemap.ts`（后续增强）
  - `src/app/robots.ts`（后续增强）
  - `src/app/skill/[slug]/page.tsx`
- 产出物：
  基础 metadata；`sitemap`、`robots`、结构化数据保留为后续增强。
- 完成定义：
  公开页面具备基础 SEO 能力，搜索引擎可理解页面主题。
- 验证方式：
  打开页面源码，检查 metadata 输出；如后续补做高级 SEO，再额外检查 JSON-LD、sitemap 和 robots。
- 关联验收：
  `AC-NFR-03`
- 常见失败点：
  - 站点 URL 硬编码且无法通过环境变量覆盖。
  - 首页和详情页 title/description 重复。

### T5-02 构建、部署与发布检查

- 目标：
  让站点达到可构建、可发布检查的最低标准。
- 前置条件：
  `T5-01`
- 当前 V1 注记：
  当前首版只要求生产构建与基础发布检查；Docker / Caddy / 部署硬化不作为首版阻塞项。
- 输入：
  技术基线和上线指标。
- 锁定决策：
  当前 V1 发布基线不是 Docker Compose + Caddy，而是先确保生产构建可通过、环境变量边界清楚、页面 smoke check 完成。
- 执行步骤：
  1. 运行并确认 `npm run build` 通过。
  2. 增加或校对 `.env.example`，声明 `DATABASE_URL` 和 `NEXT_PUBLIC_SITE_URL`。
  3. 输出发布前检查清单。
  4. Dockerfile、`docker-compose.yml`、`Caddyfile` 与部署硬化留作后续 backlog。
- 涉及文件/命令：
  - `Dockerfile`（后续增强）
  - `docker-compose.yml`（后续增强）
  - `Caddyfile`（后续增强）
  - `.env.example`
  - `npm run build`
- 产出物：
  生产构建验证、环境变量说明和发布检查清单；容器化部署文件保留为后续增强。
- 完成定义：
  本地生产构建成功，基础 smoke check 通过，公开页面能正常访问。
- 验证方式：
  运行 `npm run build`，并对首页、分类页、详情页、关于页做基础 smoke check。
- 关联验收：
  `AC-NFR-01`, `AC-NFR-02`, `AC-NFR-03`
- 常见失败点：
  - 未持久化 SQLite 文件。
  - 只验证 `dev` 环境，未验证生产构建。

---

## 5. 全局验证清单

- 当前 V1 必验以最小闭环为准，不把搜索建议、公开 API、完整 SEO 硬化和 Docker/Caddy 作为首版默认验收项。
- `npm run dev` 可正常启动。
- `npm run build` 无编译错误。
- 首页支持默认浏览、筛选、排序、搜索结果态和分页。
- 详情页支持 404、Markdown、可读的原生 `pre/code` 和外链条件渲染。
- 分类页支持合法 slug 渲染和非法 slug 404。
- 顶部搜索框和首页 Hero 搜索框统一提交到 `/?q=` 结果态，不要求实时 suggestions、防抖和键盘建议面板。
- 所有公开页面具备基础 metadata。
- 桌面端与移动端 smoke check 通过，搜索框、筛选、分页与主导航具备基础键盘可用性。
- 当前 V1 不要求 API 四个端点、`sitemap`、`robots`、JSON-LD、Docker 构建或本地 Compose 启动通过。

---

## 6. 风险与决策记录

- 风险：域名未定。
  处理：使用 `NEXT_PUBLIC_SITE_URL` 环境变量，开发环境默认 `http://localhost:3000`。
- 风险：后续若需要更大规模搜索或更好相关性，基础字段匹配可能不够。
  处理：当前 V1 先坚持基础 `/?q=` 结果态；待真实需求出现后，再单独评估 FTS5、触发器和高亮片段，不提前把它们设为基线阻塞。
- 风险：未来若需要开放投稿，当前 seed-data 模型会成为临时方案。
  处理：V1 先接受文件式录入，V2 再考虑后台或 CMS。

---

## 7. 给编程 Agent 的标准任务模板

```md
## 任务
[一句话说明当前任务卡的目标]

## 上下文
- 项目：PowerUp V1
- 代码根目录：E:\cursorproject\PowerUp\site
- 当前任务卡：[填入任务 ID]
- 相关 PRD 验收项：[填入 AC 编号]
- 相关文件：[列出必须阅读的文件]

## 要求
1. 仅完成当前任务卡范围内的内容。
2. 不修改 specs-v1 目录外的文档。
3. 如新增接口或类型，必须与 PRD 字段名一致。
4. 完成后给出验证方法。

## 输出
- 改动文件路径
- 关键实现说明
- 验证结果
```

---

## 8. 官方参考

- Next.js `create-next-app`:
  https://nextjs.org/docs/app/api-reference/cli/create-next-app
- Next.js 安装与系统要求:
  https://nextjs.org/docs/app/getting-started/installation
- Next.js Dynamic Segments:
  https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
- Next.js `generateStaticParams`:
  https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- Next.js 关于 `searchParams` 的动态渲染说明:
  https://nextjs.org/docs/app/building-your-application/routing/defining-routes
- shadcn/ui Next.js 安装:
  https://ui.shadcn.com/docs/installation/next
- shadcn CLI:
  https://ui.shadcn.com/docs/cli
- Drizzle `generate`:
  https://orm.drizzle.team/docs/drizzle-kit-generate
- Drizzle `migrate`:
  https://orm.drizzle.team/docs/drizzle-kit-migrate
- Drizzle `push`:
  https://orm.drizzle.team/docs/drizzle-kit-push
