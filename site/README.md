# PowerUp Site

`site/` 是 PowerUp 当前实际运行根。这个 README 只记录运行方式、验证命令、数据路径和当前边界，不承担产品进度说明职责。

## 当前包含什么

- Next.js App Router 页面：
  - `/`
  - `/category/[category]`
  - `/skill/[slug]`
  - `/about`
- 只读 API：
  - `GET /api/v1/skills`
  - `GET /api/v1/skills/[slug]`
  - `GET /api/v1/categories`
  - `GET /api/v1/content/about`
- SQLite + Drizzle 数据层
- 基于 `node:test` 的单元测试和真实构建 smoke 测试

## 先看这些

- 仓库级说明：[`../README.md`](../README.md)
- 当前实现文档入口：[`../docs/README.md`](../docs/README.md)
- 当前系统状态：[`../docs/CURRENT-STATE.md`](../docs/CURRENT-STATE.md)
- 当前开发方式：[`../docs/DEVELOPMENT.md`](../docs/DEVELOPMENT.md)
- 漂移与真源：[`../docs/DRIFT-AND-SOURCES-OF-TRUTH.md`](../docs/DRIFT-AND-SOURCES-OF-TRUTH.md)

## 本地命令

```bash
npm install
npm run dev
npm run dev:clean
npm run lint
npm run typecheck
npm run test
npm run test:smoke
npm run verify
npm run build
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
```

### 开发启动行为

- `npm run dev` 会先运行 `scripts/dev-preflight.ts`
- 预检会清理当前项目残留的 `next dev` 进程和 `.next/dev/lock`
- `npm run dev:clean` 只执行预检清理，不启动开发服务器
- 预检只会自动终止当前项目相关的 Next 开发进程；其他占用同端口的非本项目进程只会告警，不会强杀

## 数据库说明

- 默认数据库路径：`site/data/powerup.db`
- 如果未设置 `DATABASE_URL`：
  - `npm run dev` 会在默认本地库缺 schema 时自动执行 `db:push`
  - 默认本地库已建表但为空时会自动执行 `db:seed`
- 如果显式设置了 `DATABASE_URL`：
  - `npm run dev` 不会替你自动初始化这套库
  - 缺少 `skills` 表时会提示先手动运行 `npm run db:push`
- `npm run db:seed` 按 `slug` upsert，可重复执行
- `npm run db:push` 当前实际执行 `drizzle-kit push --force`，只适合本地开发环境

## 验证命令

- `npm run lint`：ESLint
- `npm run typecheck`：TypeScript 无输出检查
- `npm run test`：`validation.ts` 与 `queries/skills.ts` 的逻辑测试
- `npm run test:smoke`：临时 SQLite + `db:push` + `db:seed` + `next build` + 本地生产模式 smoke
- `npm run verify`：串行执行 `lint`、`typecheck`、`test`、`test:smoke`

2026-04-11 本次核对中，`npm run lint`、`npm run typecheck`、`npm run test`、`npm run test:smoke` 已重新执行并通过。

## 当前边界

- 前台和只读 API 只暴露已发布条目
- 搜索仍是基础字段匹配，不含 FTS5、搜索建议或高亮片段
- 没有后台、账号体系、公开写接口或投稿审核流
- `site/` 仍同时承担页面层和只读 API 提供方职责
