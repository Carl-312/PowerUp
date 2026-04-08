# 目录结构

**分析日期：** 2026-04-07

## 仓库根

- `site/`
  - 唯一可运行的 Next.js 应用子目录
- `specs-v1/`
  - V1 产品规格、术语契约、路由契约、walkthrough 文档
- `docs/`
  - 当前为空
- `.planning/codebase/`
  - 本次 GSD map 生成的代码库映射文档

## `site/` 子项目结构

### 配置与清单

- `site/package.json`
- `site/package-lock.json`
- `site/tsconfig.json`
- `site/next.config.ts`
- `site/eslint.config.mjs`
- `site/postcss.config.mjs`
- `site/drizzle.config.ts`
- `site/components.json`
- `site/.gitignore`
- `site/README.md`

### 静态资源

- `site/public/*`
- `site/src/app/favicon.ico`

### 应用路由

- `site/src/app/layout.tsx`
- `site/src/app/page.tsx`
- `site/src/app/about/page.tsx`
- `site/src/app/category/[category]/page.tsx`
- `site/src/app/skill/[slug]/page.tsx`
- `site/src/app/globals.css`

### 组件

- 目录页相关：
  - `site/src/components/site-search-form.tsx`
  - `site/src/components/skill-directory.tsx`
- 详情页相关：
  - `site/src/components/skill/code-block.tsx`
  - `site/src/components/skill/markdown-renderer.tsx`
  - `site/src/components/skill/skill-detail-header.tsx`
- 通用 UI：
  - `site/src/components/ui/**`

### 内容与数据

- 静态内容：
  - `site/src/content/about.md`
- 数据层：
  - `site/src/db/index.ts`
  - `site/src/db/schema.ts`
  - `site/src/db/seed.ts`
  - `site/src/db/seed-data.ts`
- 运行时数据库文件：
  - `site/data/powerup.db*`

### 共享逻辑

- 查询层：`site/src/lib/queries/skills.ts`
- 参数解析：`site/src/lib/validation.ts`
- 分类常量：`site/src/lib/categories.ts`
- 通用工具：`site/src/lib/utils.ts`
- 共享类型：`site/src/types/skill.ts`

## 命名与组织模式

- App Router 动态路由文件夹使用 Next 约定：
  - `[category]`
  - `[slug]`
- 共享常量集中到单一模块，不在页面文件中重复维护：
  - 分类在 `site/src/lib/categories.ts`
  - 类型和字段边界在 `site/src/types/skill.ts`
- 查询逻辑集中在 `site/src/lib/queries/skills.ts`，不是散落在页面里
- 页面层文件名基本保持 Next 默认命名：`page.tsx`、`layout.tsx`

## 当前缺失但值得注意的目录

- 没有 `site/src/app/api/`
- 没有 `site/src/hooks/`
- 没有 `site/src/actions/` 或 server actions 目录
- 没有 `site/tests/`、`__tests__/`、`e2e/`
- `site/drizzle/` 作为 Drizzle 输出目录在配置里声明了，但当前工作树里未看到已生成内容
- 仓库根没有 `.gitignore`，因此 `.planning/` 这类根目录产物默认不会被忽略

## 结构判断

- 项目不是多包并行开发的 monorepo
- 也不是“代码和文档全混在一起”的无序目录
- 当前结构体现出比较明确的职责分层，只是知识主要沉淀在 `specs-v1/`，而不是 `docs/`

## 结论

- 目录组织已经足够支撑持续迭代。
- 后续 brownfield 接入时，最重要的认知是：仓库根是协调层，`site/` 才是执行层。
