# PowerUp

PowerUp 是一个面向已发布 Skill 与 MCP Server 的目录站，帮助用户先浏览、再筛选、再决定是否继续了解或接入。

`/home/carl/PowerUp` 是仓库根协调层，不是单一应用根。当前实际结构如下：

- [`site/`](./site/)：当前运行中的 Next.js 站点，包含页面、只读 API、SQLite/Drizzle 数据层和验证脚本
- [`frontendv2/`](./frontendv2/)：独立前端实验工作区，按 API-first 方式消费 `site` 暴露的接口
- [`shared/`](./shared/)：前后端共享 taxonomy 与 API contract
- [`docs/`](./docs/)：基于当前代码整理的实现说明、开发方式和漂移说明
- [`specs-v1/`](./specs-v1/)：产品目标与 contract，属于约束层，不等于当前实现快照

## 当前可用能力

- 页面入口：
  - `/`
  - `/category/[category]`
  - `/skill/[slug]`
  - `/about`
- 只读 API：
  - `/api/v1/skills`
  - `/api/v1/skills/[slug]`
  - `/api/v1/categories`
  - `/api/v1/content/about`
- 数据来源：
  - `site/src/db/schema.ts`
  - `site/src/db/seed-data.ts`
  - 默认本地库 `site/data/powerup.db`

## 运行与验证

从 [`site/`](./site/) 执行：

```bash
cd site
npm install
npm run dev
```

常用验证命令：

```bash
npm run lint
npm run typecheck
npm run test
npm run test:smoke
npm run verify
```

`npm run dev` 当前会先执行开发预检，清理当前项目遗留的 `next dev` 进程和 `.next/dev/lock`；未显式设置 `DATABASE_URL` 时，还会为默认本地 SQLite 自动补建 schema，并在空库时自动写入 seed。

## 当前边界

- 前台只展示 `review_status = "published"` 的条目
- 搜索是基础字段匹配，不包含 FTS5、搜索建议或高亮片段
- 当前只有只读 API，没有后台、账号体系、投稿审核流或公开写接口
- `frontendv2/` 仍是独立工作区，不是当前正式运行入口

## 建议阅读顺序

1. [`AGENTS.md`](./AGENTS.md)
2. [`docs/README.md`](./docs/README.md)
3. [`docs/CURRENT-STATE.md`](./docs/CURRENT-STATE.md)
4. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
5. [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md)
6. [`site/README.md`](./site/README.md)

如果目标是判断“当前代码已经实现了什么”，优先相信 `site/src/**` 与 `docs/**`，不要把 `specs-v1/**` 或 `.planning/**` 当成当前实现真源。
