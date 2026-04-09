# PowerUp Site

`site/` 是 PowerUp 当前的 Next.js 运行根。
这个 README 只负责本地运行、验证和目录提示，不再承担项目完成度说明或当前实现真源职责。

## What Lives Here

- Next.js App Router 目录站
- SQLite + Drizzle 数据层
- 当前公开路由：
  - `/`
  - `/category/[category]`
  - `/skill/[slug]`
  - `/about`
- 当前服务端查询层：`src/lib/queries/skills.ts`
- 当前 URL 参数归一化层：`src/lib/validation.ts`
- 当前公开 API：`src/app/api/v1/**`

## Read Before Editing

- 仓库级上下文：[`../AGENTS.md`](../AGENTS.md)
- 当前实现文档入口：[`../docs/README.md`](../docs/README.md)
- 当前架构说明：[`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
- 当前开发方式：[`../docs/DEVELOPMENT.md`](../docs/DEVELOPMENT.md)
- 当前漂移登记：[`../docs/DRIFT-AND-SOURCES-OF-TRUTH.md`](../docs/DRIFT-AND-SOURCES-OF-TRUTH.md)

## Local Commands

```bash
npm install
npm run dev
npm run lint
npm run test
npm run test:smoke
npm run typecheck
npm run verify
npm run build
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
```

## Database Notes

- Default database path: `site/data/powerup.db`
- If the directory or file is missing, the app and DB scripts create it on first use.
- Override with `DATABASE_URL` if needed.
- `npm run db:seed` is safe to repeat and updates rows by `slug`.
- `npm run db:push` 当前实际执行的是 `drizzle-kit push --force`，只适合本地开发环境。

## Verification

- `npm run verify` 是当前仓库内统一的本地验证入口
- 当前 CI 也会在 `site/` 目录执行 `npm run verify`
- 页面级 smoke 覆盖当前公开页面和 404 可见性基线
- 本次还把 `/api/v1/**` 纳入 smoke 基线，供 `frontendv2/` 消费

## Frontend Split

- `site/` 仍保留当前 Next.js 页面
- 新的独立前端重构工作区位于 `../frontendv2/`
- 前后端共享 taxonomy 与 API contract 位于 `../shared/`
- 如果你要做完全前端重构，优先看 `../frontendv2/README.md` 和 `../docs/FRONTEND-V2-SEPARATION.md`

## Search Boundary

- 当前搜索基线是首页 `/?q=` 参数驱动的普通字段匹配
- 当前没有 FTS5、搜索建议、高亮片段或公开搜索 API
- 如果需要了解这些边界为什么存在，优先看 `../docs/**`、`../specs-v1/` 的 contract 文档，以及 `../specs-v1/_history/` 的历史文档，而不是把本 README 当成产品进度文档
