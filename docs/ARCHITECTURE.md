# Architecture

当前系统是一个单应用 Next.js 目录站，主链路清晰地落在 `app -> validation/query -> db`，没有内部 API 中转层。

## 系统边界

- 应用根：`site/`
- 路由层：`site/src/app/**`
- 展示层：`site/src/components/**`
- 输入归一化层：`site/src/lib/validation.ts`
- 查询层：`site/src/lib/queries/skills.ts`
- 数据层：`site/src/db/**`
- 静态内容层：`site/src/content/about.md`

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

### 输入与查询层

- `validation.ts`
  - 只负责 URL 参数归一化和边界收口
  - 不直接访问数据库
- `queries/skills.ts`
  - 只负责目录查询和结果映射
  - 内含 `published` 过滤、分页、排序、搜索 where 条件和 JSON 文本数组解码

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

- 没有 `site/src/app/api/**`
- 没有后台管理系统
- 没有消息队列、任务调度、缓存层或事件总线
- 没有复杂外部 SaaS 集成
- 没有单独的 repository/service/use-case 多层业务抽象

## 当前架构结论

- 这是一个偏轻量的服务端渲染目录站，而不是平台型系统。
- 当前最重要的稳定边界不是“再加一层抽象”，而是保持：
  - 路由层只管页面职责
  - 校验层只管 URL 输入
  - 查询层只管读模型与可见性规则
  - 数据层只管 SQLite/Drizzle 连接与 schema
