# Current State

本文只描述当前代码已经实现什么、还缺什么，以及本次已重新验证和未重新验证什么。

## 本次核对范围

- 已读取：`site/src/app/**`、`site/src/lib/**`、`site/src/db/**`、`site/src/types/**`、`frontendv2/src/**`、`site/scripts/**`、`.github/workflows/**`
- 已对照：`docs/**`、`README.md`、`frontendv2/README.md`、`specs-v1/PRD.md`、两份 contract、两份 walkthrough 历史文档、`site/README.md`
- 已做 seed 基线核对：`site/src/db/seed-data.ts` 当前定义 18 条样本记录，默认全部进入 `published`，分类覆盖 8 个一级分类

## 已实现

### 页面与路由

- 首页 `/`
  - 已存在真实页面
  - 承载默认列表、`q` 搜索结果、`type`/`category`/`sort`/`page` 过滤
  - 顶部搜索框和 Hero 搜索框都以 GET 提交到 `/`，有关键词时形成 `/?q=`
- 分类页 `/category/[category]`
  - 已存在真实页面
  - 分类由路径锁定
  - 页面内只保留 `type`、`sort`、`page`
  - 非法分类直接 404
- 详情页 `/skill/[slug]`
  - 已存在真实页面
  - 通过 `generateStaticParams()` 预生成已发布 slug
  - 设置 `revalidate = 3600`
  - 不存在或未发布 slug 返回 404
- 关于页 `/about`
  - 已存在真实页面
  - 内容来自 `site/src/content/about.md`

### API 与前后端分离

- 已存在公开读取 API，不再是“只有页面直连查询层”的状态
  - `GET /api/v1/skills`
  - `GET /api/v1/skills/:slug`
  - `GET /api/v1/categories`
  - `GET /api/v1/content/about`
- `site/src/lib/api/response.ts` 与 `site/src/lib/api/serializers.ts` 已承担 API 返回封装与 DTO 序列化职责
- `site/src/lib/content/about.ts` 已承担 About 文档读取职责
- `shared/**` 已承担前后端共享 taxonomy 与 API contract
- `frontendv2/` 已通过独立 API client 消费上述接口，不再依赖 `site` 内部服务端查询导入

### Frontend V2 当前状态

- `frontendv2/` 已存在真实独立项目边界，不是概念目录
- 当前已经实现：
  - 首页 `/`
  - 分类页 `/category/:category`
  - 详情页 `/skill/:slug`
  - 关于页 `/about`
- 当前已具备：
  - `react-router-dom` 路由与 loader
  - API-first 请求层与开发 fallback
  - 目录筛选、分页、错误态和加载态
  - 一轮视觉精修与首屏性能优化
    - 路由级懒加载
    - Markdown 按需分包
    - 非首屏内容延后渲染
    - 字体加载策略优化

### 查询与参数处理

- 查询层已经存在，不是待开发状态
  - `listSkills(filters)`
  - `getSkillBySlug(slug)`
  - `getPublishedSlugs()`
  - `getCategoryCounts()`
- 首页参数解析已经存在
  - `q`、`type`、`category`、`sort`、`page`
  - 非法值回退到安全默认值
  - 空白搜索词会被归一化为未搜索状态
- 分类页参数解析已经存在
  - 路径固定 `category`
  - 查询参数只接受 `type`、`sort`、`page`
  - `q` 在分类页解析中被主动忽略

### 搜索与列表行为

- 完整搜索结果只在首页承载，没有独立 `/search` 页面
- 搜索范围覆盖：
  - `name`
  - `summary`
  - `description`
  - `tags` JSON 文本
- 多个搜索词按空白拆词后逐词匹配；每个词需要命中上述字段之一
- 列表只显示 `published` 状态
- 默认排序是 `updated_at` 倒序，其次按名称升序
- 默认每页 24 条

### 数据与内容

- 真实 schema 已存在，中心表是 `skills`
- `tags`、`supported_platforms` 在库中以 JSON 文本存储，在查询层恢复为字符串数组
- `review_status`、`source_kind`、类型枚举、分类枚举都已有集中定义
- 当前 seed 基线为 18 条样本记录，类型覆盖 `skill` 与 `mcp_server`
- 当前仓库树里不要求预置 `site/data/powerup.db`；未设置 `DATABASE_URL` 时，默认路径会在首次数据库访问时按代码约定创建

## 当前边界与明显缺口

- 虽然已经有 `api/v1`，但 `site/` 当前仍同时承担旧页面与 BFF/API 两种职责
- `frontendv2/` 已具备迁移基线，但还没有替换正式运行入口
- 没有后台系统、用户体系、投稿审核流、公开写接口
- 没有 FTS5、搜索建议、高亮片段或独立搜索接口
- 已有最小自动化验证基线
  - `node:test` + `tsx`
  - 当前覆盖 `site/src/lib/validation.ts`、`site/src/lib/queries/skills.ts` 与最小页面级 smoke
  - 已有仓库内 `verify` 入口与最小 CI
- 已有最小页面级 smoke 自动化
  - 基于临时 SQLite、真实 `next build` 和本地生产模式 Next 服务启动
  - 覆盖首页、`/?q=`、分类页、详情页以及未发布/不存在 slug 的可见性
- 仍然没有浏览器交互型 E2E 自动化
- 没有仓库内可审计的部署配置
- 旧 `site/` 与 `frontendv2/` 之间还没有进入“逐页替换正式前端”的执行阶段

## 本次已重新验证

- `frontendv2/npm run typecheck`
- `frontendv2/npm run build`

## 未在本次任务中再次验证

- `site/npm run lint`
- `site/npm run typecheck`
- `site/npm run test`
- `site/npm run test:smoke`
- `site/npm run verify`
- 浏览器交互型 E2E
- 生产部署流程
