# Development

当前仓库已经分成两个开发工作区：

- `site/`：现有 Next.js 运行根、数据库层和 `api/v1`
- `frontendv2/`：独立前端重构工作区

因此不是所有命令都再从 `site/` 执行；需要按职责分别进入对应目录。

## 应用根

- 当前工作区仓库根：`/home/carl/PowerUp`
- 当前后端 / BFF 根：`/home/carl/PowerUp/site`
- 当前独立前端根：`/home/carl/PowerUp/frontendv2`

不要在仓库根直接执行 Next.js、Drizzle、数据库脚本或 frontendv2 的构建命令。

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

在 `frontendv2/` 目录下：

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

如果你当前目标是把 `frontendv2/` 逐步移植到正式前端，开始前建议先读：

- `frontendv2/README.md`
- `docs/FRONTEND-V2-SEPARATION.md`
- `docs/FRONTEND-V2-MIGRATION-PROMPT.md`

## 数据库路径与 `DATABASE_URL`

### 运行时

- `site/src/db/index.ts` 会优先读取 `DATABASE_URL`
- 未设置时默认回退到 `data/powerup.db`
- 相对路径会相对于 `site/` 运行目录解析
- 按当前目录约定，默认数据库文件就是 `site/data/powerup.db`
- 若目录或文件不存在，运行时代码会在首次访问时自动创建；仓库本身不保证预置该文件

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
  - `/api/v1/skills`
  - `/api/v1/skills/[slug]`
  - `/api/v1/categories`
  - `/api/v1/content/about`

这样页面级验证也不需要把 `site/data/powerup.db` 当作唯一前提。

`npm run verify` 会串行执行：

- `lint`
- `typecheck`
- 逻辑层自动化测试
- 页面级 smoke 自动化
- API 边界 smoke 自动化

因此本地和 CI 都不需要把 `site/data/powerup.db` 当作唯一前提。

### 人工 spot check

如果需要在视觉层面再做一次快速人工确认，启动开发服务器后优先检查这些入口：

- `/`
- `/?q=mcp`
- `/?type=skill`
- `/category/developer-tools`
- `/skill/everything-mcp`
- `/about`

如果要人工确认独立前端，额外检查：

- `frontendv2` 首页
- `frontendv2/category/developer-tools`
- `frontendv2/skill/everything-mcp`
- `frontendv2/about`

如果要做“逐步迁移到正式前端”的小步提交，建议每一轮都遵守：

- 先选一个页面或一个局部模块，不做大爆炸替换
- 先跑 `frontendv2` 的 `typecheck` 与 `build`
- 再跑 `site/` 下与本轮变更有关的验证
- 最后再做人工 spot check

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
- 已有可单独安装与构建的 `frontendv2/`
- 已有可继续迁移的 `frontendv2/` 基线，但尚未替换正式入口
- 没有仓库内可审计的部署配置

因此当前验证方式仍以：

- 本地运行
- lint
- test
- test:smoke
- typecheck
- build
- verify
- frontendv2 typecheck
- frontendv2 build
- 人工 spot check

为主。

## 本文边界

- 本文只记录当前代码可见的开发方式
- 不对部署平台、生产环境注入方式或上线流程做超出仓库事实的推断
