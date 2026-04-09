# Architecture

当前系统已经从“单应用 Next.js 目录站”演进成“双层结构”：

- `site/` 仍然承载现有 Next.js 页面
- `site/` 同时开始承担 BFF/API 层
- `frontendv2/` 是独立前端工作区

旧站主链路仍然是 `app -> validation/query -> db`，但现在额外补出 `app/api/v1 -> validation/query -> db` 这一条独立前端可消费的链路。

## 系统边界

- 应用根：`site/`
- 路由层：`site/src/app/**`
- API 路由层：`site/src/app/api/v1/**`
- 展示层：`site/src/components/**`
- 输入归一化层：`site/src/lib/validation.ts`
- 查询层：`site/src/lib/queries/skills.ts`
- 数据层：`site/src/db/**`
- 静态内容层：`site/src/content/about.md`
- 共享协议层：`shared/**`
- 独立前端层：`frontendv2/src/**`

仓库根不是运行时应用层；它只是规格、文档和运营文件的协调层。

## 主路径

### 首页与分类页

1. 页面从 URL 读取 `searchParams`
2. `validation.ts` 负责归一化、枚举校验和默认值回退
3. `queries/skills.ts` 负责拼装 where 条件、排序和分页
4. `db/index.ts` 提供 Drizzle + SQLite 连接
5. `db/schema.ts` 定义 `skills` 表结构
6. 结果回到 `SkillDirectory` 等展示组件

### 详情页

1. 页面读取 `params.slug`
2. `getSkillBySlug()` 直接查 `published` 记录
3. 查不到时 `notFound()`
4. 查到后交给 `SkillDetailHeader`、`MarkdownRenderer`、`CodeBlock` 渲染

### 关于页

1. 页面从 `src/content/about.md` 读取 Markdown
2. 使用 `MarkdownRenderer` 输出说明内容
3. 不依赖数据库，也不承载目录搜索结果

### API v1

1. Route Handler 从请求读取 `params` / `searchParams`
2. 复用 `validation.ts` 做 URL 参数归一化
3. 复用 `queries/skills.ts` 与 `content/about.ts`
4. 通过 `shared/powerup-api-contract.ts` 约束 JSON envelope
5. 返回给 `frontendv2/` 这类独立前端消费者

## 分层说明

### App Router 页面层

- `layout.tsx`
  - 提供站点壳层、全局导航、统一搜索表单和页脚
  - 不读取 `searchParams`
- `page.tsx`
  - 首页
  - 直接调用查询层
- `category/[category]/page.tsx`
  - 分类页
  - 路径锁定分类上下文
- `skill/[slug]/page.tsx`
  - 详情页
  - 静态参数 + 定时再验证
- `about/page.tsx`
  - 内容说明页

### API / BFF 层

- `api/v1/skills/route.ts`
  - 目录列表、filters、分页和分类统计
- `api/v1/skills/[slug]/route.ts`
  - 详情读取
- `api/v1/categories/route.ts`
  - 分类统计
- `api/v1/content/about/route.ts`
  - About 内容文档

### 输入与查询层

- `validation.ts`
  - 只负责 URL 参数归一化和边界收口
  - 不直接访问数据库
- `queries/skills.ts`
  - 只负责目录查询和结果映射
  - 内含 `published` 过滤、分页、排序、搜索 where 条件和 JSON 文本数组解码
- `lib/api/serializers.ts`
  - 负责把查询结果映射成独立前端消费的 API DTO
- `lib/api/response.ts`
  - 负责统一 JSON envelope 和错误返回结构
- `lib/content/about.ts`
  - 负责复用 About Markdown 读取逻辑，供页面与 API 共用

### 数据层

- `db/schema.ts`
  - 定义表结构、枚举约束和索引
- `db/index.ts`
  - 解析 `DATABASE_URL`
  - 默认回退到 `data/powerup.db`
  - 启动时确保目录存在，并开启 SQLite WAL
- `db/seed.ts`
  - 将 seed 数据转成表结构并按 `slug` upsert
- `db/seed-data.ts`
  - 当前样本内容基线

## 明确不存在的层

- 没有后台管理系统
- 没有消息队列、任务调度、缓存层或事件总线
- 没有复杂外部 SaaS 集成
- 没有单独的 repository/service/use-case 多层业务抽象

## 当前架构结论

- `site/` 现在是“旧页面 + BFF”双角色，而不是单纯页面应用。
- `frontendv2/` 是独立前端重构容器，不应再回退为数据库直连壳层。
- 当前最重要的稳定边界是：
  - 页面层只管 UI 与路由语义
  - API 层只管公开 JSON 契约
  - 校验层只管 URL 输入
  - 查询层只管读模型与可见性规则
  - 数据层只管 SQLite/Drizzle 连接与 schema
