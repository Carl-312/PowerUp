# 技术栈

**分析日期：** 2026-04-07

## 总览

- 这是一个 brownfield 仓库，真正可运行的应用不在仓库根，而在 `site/` 子目录。
- 仓库根目前更像“规格 + 站点实现”的组合体：`specs-v1/` 放产品与实现契约，`site/` 放 Next.js 站点，`docs/` 当前为空。
- 根目录没有 `package.json`、`pnpm-workspace.yaml`、`turbo.json` 或 `nx.json`，因此它不是 monorepo 工具驱动的多包工程。

## 运行时与包管理

- Node.js 应用，入口 manifest 在 `site/package.json`。
- 包管理器是 `npm`，证据是 `site/package-lock.json`。
- 常用脚本都定义在 `site/package.json`，并且应从 `site/` 目录执行：
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `eslint`
  - `typecheck`: `tsc --noEmit`
  - `db:generate`: `drizzle-kit generate`
  - `db:push`: `drizzle-kit push --force`
  - `db:seed`: `tsx src/db/seed.ts`
  - `db:studio`: `drizzle-kit studio`

## 核心框架与库

- Web 框架：`next@16.2.2`
- 前端运行时：`react@19.2.4`、`react-dom@19.2.4`
- 语言与类型系统：TypeScript 5，配置在 `site/tsconfig.json`
- 数据层：
  - `drizzle-orm@0.45.2`
  - `drizzle-kit@0.31.10`
  - `better-sqlite3@12.8.0`
- 校验：`zod@4.3.6`
- Markdown 渲染：
  - `react-markdown@10.1.0`
  - `remark-gfm@4.0.1`
- UI / 样式：
  - `tailwindcss@^4`
  - `@tailwindcss/postcss@^4`
  - `tw-animate-css@^1.4.0`
  - `radix-ui@^1.4.3`
  - `lucide-react@^1.7.0`
  - `shadcn@^4.1.2`
  - `class-variance-authority`、`clsx`、`tailwind-merge`
- 其他开发工具：
  - `tsx@4.21.0`
  - `eslint@^9`
  - `eslint-config-next@16.2.2`

## 配置文件与工程化入口

- `site/next.config.ts`: Next.js 配置入口，目前内容极简。
- `site/tsconfig.json`: 开启 `strict`、`noEmit`、`moduleResolution: bundler`、路径别名 `@/*`。
- `site/eslint.config.mjs`: 使用 `eslint-config-next/core-web-vitals` 和 `eslint-config-next/typescript`。
- `site/postcss.config.mjs`: PostCSS 配置入口。
- `site/drizzle.config.ts`: Drizzle 配置，schema 指向 `site/src/db/schema.ts`，输出目录设为 `site/drizzle/`。
- `site/components.json`: shadcn 配置，`style` 为 `radix-nova`，启用 RSC、TSX、CSS variables，图标库是 `lucide`。

## 数据存储与本地运行

- 默认数据库路径来自 `site/drizzle.config.ts` 与 `site/src/db/index.ts`：
  - `DATABASE_URL` 未设置时，回退到 `data/powerup.db`
- 运行时实际使用 SQLite，本地数据库文件位于 `site/data/powerup.db`
- 当前工作区里已经存在本地数据库文件：
  - `site/data/powerup.db`
  - `site/data/powerup.db-shm`
  - `site/data/powerup.db-wal`
- `site/src/db/index.ts` 会在启动时创建数据库目录，并设置 `journal_mode = WAL`

## 前端实现风格

- 路由采用 Next App Router，页面文件在 `site/src/app/`
- 页面层当前以服务端组件为主，首页、分类页、详情页、关于页都直接在服务端读取数据或内容
- 样式主要通过 Tailwind 工具类直接写在 TSX 里，基础设计 token 定义在 `site/src/app/globals.css`
- 全站文案以中文为主，但技术常量、类型、函数名保持英文命名

## 直接可见的技术边界

- 没有发现独立 API 层入口，例如 `site/src/app/api/**`
- 没有发现 monorepo 编排、队列、后台 worker、消息总线或容器化配置
- 没有发现根级部署描述文件，例如 `Dockerfile`、`vercel.json`、`netlify.toml`、`.github/workflows/*`

## 结论

- 这个项目已经不是脚手架初始化阶段，而是一个“站点已成形、工程仍偏轻量”的单应用 brownfield 项目。
- 技术选型清晰且集中：`Next.js + React + TypeScript + Tailwind + Drizzle + SQLite`。
- 如果继续做 GSD 接入，工作重心应放在理解 `site/` 子应用，而不是误把仓库根当作应用根。
