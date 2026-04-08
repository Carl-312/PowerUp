# Development

当前应用的开发、构建和数据库命令都必须从 `site/` 目录执行。

## 应用根

- 仓库根：`E:\cursorproject\PowerUp`
- 应用根：`E:\cursorproject\PowerUp\site`

不要在仓库根直接执行 Next.js、Drizzle 或数据库脚本。

## 本地命令

在 `site/` 目录下：

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

## 数据库路径与 `DATABASE_URL`

### 运行时

- `site/src/db/index.ts` 会优先读取 `DATABASE_URL`
- 未设置时默认回退到 `data/powerup.db`
- 相对路径会相对于 `site/` 运行目录解析
- 按当前目录约定，默认数据库文件就是 `site/data/powerup.db`

### Drizzle 配置

- `site/drizzle.config.ts` 也优先读取 `DATABASE_URL`
- 未设置时同样回退到 `data/powerup.db`
- Drizzle 输出目录当前配置为 `site/drizzle/`

## Seed 方式

- `npm run db:seed` 执行 `tsx src/db/seed.ts`
- seed 数据来自 `site/src/db/seed-data.ts`
- 写入策略是按 `slug` upsert，不是盲目重复插入
- `tags` 与 `supported_platforms` 会在 seed 时转为 JSON 文本

## 本地验证入口

### 代码级验证

- `npm run lint`
- `npm run test`
- `npm run test:smoke`
- `npm run typecheck`
- `npm run build`
- `npm run verify`

`npm run test:smoke` 会创建临时 SQLite 数据库，执行：

- `db:push`
- `db:seed`
- `build`
- 基于真实 Next 路由的页面级 smoke 验证
  - `/`
  - `/?q=...`
  - `/category/[category]`
  - `/skill/[slug]`
  - 不存在或未发布 slug 的 404

这样页面级验证也不需要把 `site/data/powerup.db` 当作唯一前提。

`npm run verify` 会串行执行：

- `lint`
- `typecheck`
- 逻辑层自动化测试
- 页面级 smoke 自动化

因此本地和 CI 都不需要把 `site/data/powerup.db` 当作唯一前提。

### 人工 spot check

如果需要在视觉层面再做一次快速人工确认，启动开发服务器后优先检查这些入口：

- `/`
- `/?q=mcp`
- `/?type=skill`
- `/category/developer-tools`
- `/skill/everything-mcp`
- `/about`

### 数据库相关验证

- `npm run db:push`
- `npm run db:seed`
- `npm run db:studio`

注意：`db:push` 当前脚本是 `drizzle-kit push --force`，适合本地开发环境，不应被误当成正式发布环境的无脑默认命令。

## 当前工程化边界

- 已有最小自动化测试基线
  - 使用 Node 内置 `node:test` 和现有 `tsx`
  - 当前覆盖 `validation.ts`、`queries/skills.ts` 与最小页面级 smoke
- 已有 `test` 与 `verify` 脚本
- 已有 `test:smoke` 页面级验证入口
- 已有最小 CI workflow
- 没有仓库内可审计的部署配置

因此当前验证方式仍以：

- 本地运行
- lint
- test
- test:smoke
- typecheck
- build
- verify
- 人工 spot check

为主。

## 本文边界

- 本文只记录当前代码可见的开发方式
- 不对部署平台、生产环境注入方式或上线流程做超出仓库事实的推断
