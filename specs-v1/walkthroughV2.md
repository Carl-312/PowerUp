# PowerUp V1 Walkthrough V2

## 文档定位

- 本文是基于当前完成状态重新整理后的执行说明，目标不是重写 `PRD.md`，而是把 PowerUp 的首版交付压缩成一条更稳、更短的 MVP 路线。
- `specs-v1/walkthrough.md` 保留为历史完整版实施说明；从本轮开始，当前执行优先级、阶段切分和发版顺序以本文为准。
- 本文只负责三件事：
  - 说明当前已经有什么。
  - 锁定首版应该做什么、不做什么。
  - 把后续复杂事项明确降级为可选 backlog。

---

## 1. 当前状态快照

### 1.1 已完成基础工作

- `T0-01` 术语与目录约定
- `T0-02` 路由、渲染与搜索契约
- `T1-01` 项目脚手架
- `T1-02` UI 与基础依赖
- `T2-01` Schema 与类型
- `T2-02` 种子数据

### 1.2 已落地资产

- 已有 Drizzle SQLite schema、数据库连接封装、共享类型与分类常量。
- 已有 18 条样本数据，覆盖 8 个一级分类。
- 已有可重复执行且幂等的 seed 脚本。
- 已有数据库脚本：`db:generate`、`db:push`、`db:seed`、`db:studio`。
- 已验证：
  - `npx tsc --noEmit`
  - `npm run build`
  - `npm run db:push`
  - `npm run db:seed`

### 1.3 当前真正缺的不是“底层”，而是“可交付闭环”

- 还没有查询层。
- 还没有首页、详情页、分类页、关于页。
- 还没有可交付的搜索体验。
- 还没有基础 SEO 与发布清单。
- 当前 `site` 仍主要是脚手架默认页面，说明项目最需要的是“把已有数据真正显示出来”，而不是继续加重技术基础设施。

---

## 2. GSD 式规划结论

这次按 `gsd-discuss-phase` + `gsd-plan-phase` 的思路做轻量规划，先锁决策，再收缩主线并划出 backlog。

### 2.1 首版唯一目标

- 首版只追求一个最小闭环：
  用户可以打开网站，浏览已发布条目，按条件筛选，输入关键词搜索，进入详情页判断这个 Skill / MCP 是否值得继续研究。

### 2.2 首版锁定决策

- 页面继续直接调用服务端查询层，不通过内部 HTTP API 绕一层。
- 首页搜索先用普通 SQLite 查询实现，不做 FTS5、触发器和高亮片段。
- 首页搜索词 `q` 先走基础 `LIKE`/包含匹配，范围覆盖：
  - `name`
  - `summary`
  - `description`
  - `tags` JSON 文本
- 顶部搜索框和首页 Hero 搜索框首版统一为普通 GET 表单，提交到 `/?q=...`。
- 首版不做实时搜索建议，不做防抖，不做键盘导航面板，不做 `/api/skills/search`。
- 首版不做公开 API：
  - 不做 `/api/skills`
  - 不做 `/api/skills/[slug]`
  - 不做 `/api/categories`
- 首版继续使用当前简单数据库工作流：
  - 本地 SQLite
  - `db:push`
  - `db:seed`
- 首版不引入自定义 SQL migration、FTS5 虚拟表、触发器同步链路。
- 首版以“能稳定上线并验证方向”为目标，不把 Docker、Caddy、复杂部署编排作为阻塞项。
- 首版保留浅色优先、低 JS、服务端渲染优先的路线，不主动增加深色模式、复杂交互和额外前端状态管理。

### 2.3 后续只在真实需求出现时再评估的 backlog

- FTS5 搜索索引与触发器。
- 即时搜索建议与高亮。
- 对外公开 API。
- `sitemap`、`robots`、JSON-LD。
- Docker / Caddy / 发布硬化。
- 更大规模内容与编辑流程增强。

---

## 3. 文档整理规则

从本轮开始，文档职责收口如下：

| 文档 | 角色 |
| --- | --- |
| `specs-v1/PRD.md` | 产品目标、范围、验收标准 |
| `specs-v1/terms-and-directory-contract.md` | 术语、目录职责、枚举、分类 slug 单一真源 |
| `specs-v1/routing-render-search-contract.md` | 路由职责、渲染模式、数据流与搜索流转单一真源 |
| `specs-v1/walkthrough.md` | 历史完整版实施说明，保留参考 |
| `specs-v1/walkthroughV2.md` | 当前有效的执行顺序、阶段切分与 MVP 发版方案 |

### 3.1 使用规则

- 讨论“做什么、验收什么”时，看 `PRD.md`。
- 讨论“术语、slug、目录、内部枚举”时，看 `terms-and-directory-contract.md`。
- 讨论“路由、渲染方式、页面数据流”时，看 `routing-render-search-contract.md`。
- 讨论“本轮先做哪一批、后做哪一批”时，看 `walkthroughV2.md`。

### 3.2 本文与旧 walkthrough 的关系

- 旧 `walkthrough.md` 的问题不是方向错，而是一次性把搜索索引、公开 API、部署硬化、SEO 完整包全部拉进了同一条主线。
- 本文改为先交付目录站最小闭环，再把复杂能力移出当前主线。

---

## 4. 当前 V1 执行波次

### 4.1 阶段目标

- 用当前 18 条已验证数据，交付一个可浏览、可筛选、可搜索、可看详情的只读目录站。
- 技术上优先追求：
  - 简单
  - 可维护
  - 少依赖链路
  - 少隐性状态

### 4.2 Wave 1：查询层与 URL 参数解析

- 依赖：已完成的 `T2-01`、`T2-02`
- 目标：
  建立页面可直接调用的最小服务端查询层，不等待 FTS 和公开 API。
- 交付：
  - `src/lib/queries/skills.ts`
  - `src/lib/validation.ts`
- 必做内容：
  - `listSkills(filters)`：
    - 只返回 `published`
    - 支持 `type`、`category`、`sort`、`page`、`q`
    - 默认每页 24 条
  - `getSkillBySlug(slug)`
  - `getCategoryCounts()`
  - 如继续采用详情页 `generateStaticParams`，再补 `getPublishedSlugs()` 这类辅助函数
  - 统一把 `tags`、`supported_platforms` 从 JSON 文本转换成数组
  - `q` 先用普通字段匹配，不接 FTS
- 明确不做：
  - `searchSkillSuggestions`
  - FTS 片段高亮
  - API 响应 DTO

### 4.3 Wave 2：列表闭环

- 依赖：Wave 1
- 目标：
  一次打通全局壳层、首页、分类页和共用 GET 搜索表单。
- 必做内容：
  - Header、Footer、页面容器
  - Skill 卡片、空状态、基础筛选条
  - 首页 Hero 与首页列表
  - `/category/[category]`
  - Header 与 Hero 共用 GET 搜索行为，提交到 `/?q=关键词`
  - 分页逻辑保留，但只在 `totalPages > 1` 时渲染分页 UI
- 约束：
  - 分类页上下文由路径锁定
  - 分类页内不提供分类切换器
  - 移动端先保证可用，不把抽屉导航当首版阻塞项

### 4.4 Wave 3：内容页面

- 依赖：Wave 1、Wave 2
- 目标：
  补齐详情页和关于页，完成“能浏览也能理解”的内容闭环。
- 必做内容：
  - `/skill/[slug]`
  - `/about`
  - 详情页四个信息区
  - slug 不存在或未发布时 404
  - 关于页说明首版边界
- 首版简化：
  - 详情页使用 `react-markdown` 与可读的原生 `pre/code`
  - 不把 Shiki 效果当成首版阻塞项
  - 仅在字段有值时渲染对应区块

### 4.5 Wave 4：收尾验证

- 依赖：Wave 2、Wave 3
- 目标：
  只补基础质量，不引入额外工程化包袱。
- 必做内容：
  - 首页、详情页、分类页、关于页的基础 `title` / `description`
  - `npm run build` 通过
  - 响应式 smoke check
  - 键盘可用性 smoke check
- 不做：
  - JSON-LD
  - `sitemap.ts`
  - `robots.ts`
  - Docker / Caddy
  - 性能专项调优

### 4.6 当前 V1 完成定义

- `/` 可直接浏览已发布条目。
- `/` 支持 `type`、`category`、`sort`、`page`、`q` 五类 URL 参数。
- `/?q=` 可返回基于普通表查询的结果。
- `/skill/[slug]` 可正确渲染公开字段与 Markdown。
- `/skill/[slug]` 对不存在或未发布条目返回 404。
- `/category/[category]` 可正确渲染，非法分类返回 404。
- `/about` 为静态说明页。
- 所有公开页面有基础 metadata。
- `npm run build` 通过。
- 不要求首版具备实时建议、公开 API、FTS5、容器化部署。

### 4.7 当前 V1 明确不做

- 不做 `T2-03` FTS5 搜索索引。
- 不做 `T3-02` 公开 API，包括 `/api/skills`、`/api/skills/[slug]`、`/api/categories`、`/api/skills/search`。
- 不做 `T4-06` 即时搜索建议。
- 不做 `sitemap`、`robots`、JSON-LD。
- 不做 Docker / Caddy / 发布硬化。
- 不把 50 条以上内容规模作为当前开发阻塞项。

---

## 5. 可选 Backlog

以下内容不是默认第二阶段承诺，只在真实需求出现时再单独立项：

- 搜索增强：
  - FTS5 搜索索引与触发器
  - 即时搜索建议
  - 高亮片段
- 对外复用：
  - `/api/skills`
  - `/api/skills/[slug]`
  - `/api/categories`
  - `/api/skills/search`
- 发布与 SEO 硬化：
  - `sitemap.ts`
  - `robots.ts`
  - JSON-LD
  - Dockerfile
  - `docker-compose.yml`
  - Caddyfile
- 内容治理扩展：
  - 更大规模样本数据
  - 批量核验脚本
  - 发布前检查脚本

---

## 6. 给后续编程 Agent 的边界

- 当前主线目标是“首版 MVP”，不是“把 PRD 一次性做满”。
- 如未明确进入 backlog，默认不实现以下内容：
  - FTS5
  - 搜索建议 API
  - 公开 API
  - Docker / Caddy
  - JSON-LD
- 如果后续实现与 `terms-and-directory-contract.md` 或 `routing-render-search-contract.md` 冲突，仍以 contract 文档优先。
- 如果后续发现首版范围又开始膨胀，应优先把新需求记入 backlog，而不是继续塞进首版。

---

## 7. 一句话结论

- 当前 PowerUp 最合理的路线不是继续往下堆技术底座，而是尽快把现有 18 条高质量数据变成一个真正可用的目录站首版。
- 首版先跑通“浏览 + 筛选 + 基础搜索 + 详情 + 分类 + 关于”的低复杂度闭环；搜索索引、搜索建议、公开 API、SEO 硬化和部署编排都只保留为可选 backlog。
