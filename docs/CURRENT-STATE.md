# Current State

本文只描述当前代码已经实现什么、还缺什么，以及本次已重新验证和未重新验证什么。

## 本次核对范围

- 已读取：`site/src/app/**`、`site/src/lib/queries/skills.ts`、`site/src/lib/validation.ts`、`site/src/db/**`、`site/src/types/skill.ts`
- 已对照：`.planning/codebase/**`、`specs-v1/PRD.md`、两份 contract、`specs-v1/walkthroughV2.md`、`site/README.md`
- 已做只读数据库快照核对：本地 `site/data/powerup.db` 当前为 18 条记录，全部 `published`，分类覆盖 8 个一级分类

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

## 当前边界与明显缺口

- 没有内部 API 层
  - 未见 `site/src/app/api/**`
  - 页面直接调用服务端查询层
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
- `icon` 字段在类型和查询层存在，但本次检查到的首页卡片与详情页头部都没有实际渲染图标

## 本次已重新验证

- `npm run test`
- `npm run test:smoke`
- `npm run verify`
  - 内部顺序执行了 `lint`、`typecheck`、`test`、以及页面级 `test:smoke`
  - 本次验证不依赖仓库内现有 `site/data/powerup.db` 作为唯一前提

## 未在本次任务中再次验证

- 浏览器交互型 E2E
- 生产部署流程
