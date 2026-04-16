# Development

当前仓库至少包含两个工作区：

- `site/`：当前运行中的 Next.js 站点、只读 API 与数据库层
- `frontendv2/`：独立前端实验工作区

如果你的目标是维护当前线上形态或核对当前能力边界，优先进入 `site/`。

## 应用根

- 仓库根：`/home/carl/PowerUp`
- 当前运行根：`/home/carl/PowerUp/site`
- 独立前端工作区：`/home/carl/PowerUp/frontendv2`

不要在仓库根直接跑 Next.js、Drizzle 或数据库命令。

## `site/` 常用命令

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

### `npm run dev`

- 先运行 `scripts/dev-preflight.ts`
- 清理当前项目残留的 `next dev` 进程和 `.next/dev/lock`
- 默认本地库缺 schema 时自动执行 `db:push`
- 默认本地库已建表但为空时自动执行 `db:seed`

### `npm run dev:clean`

- 只执行开发预检清理
- 不启动开发服务器

## 数据库约定

- 默认 `DATABASE_URL`：`data/powerup.db`
- 相对路径相对于 `site/` 目录解析
- `db/index.ts` 会自动创建数据库目录，并启用 SQLite WAL
- `db:push` 当前是 `drizzle-kit push --force`，只适合本地开发
- `db:seed` 按 `slug` upsert，可重复执行

## 验证方式

### 已重新执行

2026-04-11 本次核对中，以下命令已重新执行并通过：

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:smoke`

### 验证职责

- `npm run test`
  - 逻辑层测试
  - 当前覆盖 `validation.ts` 与 `queries/skills.ts`
- `npm run test:smoke`
  - 使用临时 SQLite 数据库
  - 执行 `db:push`、`db:seed`、`next build`
  - 启动本地生产模式 Next 服务做页面与 API smoke
- `npm run verify`
  - 串行执行 `lint`、`typecheck`、`test`、`test:smoke`

## 人工 spot check 建议

开发服务器启动后，优先检查：

- `/`
- `/?q=everything`
- `/?type=skill`
- `/category/developer-tools`
- `/skill/everything-mcp`
- `/about`

## 当前工程边界

- 当前没有浏览器交互型 E2E
- 当前没有仓库内可审计的生产部署配置
- `frontendv2/` 可以继续迭代，但不是 `site/` 的正式替代入口
