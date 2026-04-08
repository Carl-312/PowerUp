# 架构映射

**分析日期：** 2026-04-07

## 系统形态

- 这是一个“规格文档 + 单个站点子应用”的 brownfield 仓库。
- 产品规格集中在 `specs-v1/`
- 实际站点实现集中在 `site/`
- `docs/` 目录当前为空，不承担主要知识承载角色

## 应用类型

- `site/` 是一个 Next.js App Router 应用
- 当前功能定位是“只读目录站”，不是开放投稿平台，也不是后台管理系统
- 系统边界很清晰：公开页面负责浏览、筛选、搜索、查看详情，不包含用户写操作

## 主要路由与渲染策略

### 首页

- 文件：`site/src/app/page.tsx`
- 输入：`searchParams`
- 职责：
  - 解析 URL 查询参数
  - 调用查询层拿列表结果
  - 渲染 Hero、搜索表单、分类入口和列表
- 特点：
  - 直接调用服务端查询层
  - 不绕内部 HTTP API

### 分类页

- 文件：`site/src/app/category/[category]/page.tsx`
- 输入：
  - `params.category`
  - `searchParams`
- 职责：
  - 校验分类 slug
  - 锁定分类上下文
  - 复用列表展示能力
- 非法分类直接 `notFound()`

### 详情页

- 文件：`site/src/app/skill/[slug]/page.tsx`
- 特点：
  - `generateStaticParams()` 预生成已发布 slug
  - `revalidate = 3600`
  - 运行时再次校验数据是否存在，否则 `notFound()`
- 页面结构围绕四块：
  - Header / 基础信息
  - 详细描述
  - 集成信息
  - 外部链接

### 关于页

- 文件：`site/src/app/about/page.tsx`
- 特点：
  - 静态说明页
  - 运行时从 `site/src/content/about.md` 读取 Markdown 内容

## 数据流

### 列表流

1. 页面层读取 `searchParams`
2. `site/src/lib/validation.ts` 负责参数归一化和 zod 校验
3. `site/src/lib/queries/skills.ts` 负责拼装查询条件、排序和分页
4. `site/src/db/index.ts` 提供 Drizzle + SQLite 连接
5. `site/src/db/schema.ts` 提供表结构和类型边界
6. 结果回到页面或展示组件，例如 `site/src/components/skill-directory.tsx`

### 详情流

1. 页面层拿到 `params.slug`
2. `getSkillBySlug()` 查询已发布记录
3. 查询不到则 404
4. 查询到则传入 `site/src/components/skill/skill-detail-header.tsx` 与内容区组件渲染

## 分层方式

- 路由层：`site/src/app/**`
- 展示层：
  - 共享页面组件：`site/src/components/skill-directory.tsx`
  - 详情页组件：`site/src/components/skill/**`
  - 通用 UI：`site/src/components/ui/**`
- 查询与输入处理层：
  - `site/src/lib/queries/skills.ts`
  - `site/src/lib/validation.ts`
  - `site/src/lib/categories.ts`
- 数据层：
  - `site/src/db/index.ts`
  - `site/src/db/schema.ts`
  - `site/src/db/seed.ts`
  - `site/src/db/seed-data.ts`
- 类型层：`site/src/types/skill.ts`

## 关键架构决策

- 页面直接调用查询模块，不通过站内 API
- 搜索通过 GET 表单提交到 `/?q=...`
- 分类页的分类上下文由路径锁定，不允许页内切换分类
- 只有 `published` 记录进入前台列表与详情
- 数据库存储中 `tags`、`supported_platforms` 以 JSON 文本落库，在查询层转换回数组

## 未看到的层

- 没有 `site/src/app/api/**`
- 没有服务对象 / repository / use-case 多层抽象
- 没有后台管理、任务调度、消息队列、缓存层
- 没有单独的 BFF 或 SDK 层

## 结论

- 当前架构是“轻量服务端渲染目录站”而不是复杂平台型架构。
- 模块边界已经形成，尤其是 `app -> validation/query -> db` 这条主路径比较清楚。
- 这很适合 brownfield 映射和后续渐进增强，不适合被误判成需要先做大规模架构重建的项目。
