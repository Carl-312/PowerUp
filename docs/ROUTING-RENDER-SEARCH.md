# Routing, Render, Search

本文说明当前真实路由、渲染模式、URL 参数、搜索流转和 404 规则，并区分哪些已经被代码验证，哪些主要来自 contract 且当前结构一致。

## 路由总表

| 路由 | 当前职责 | URL 参数 | 当前渲染判断 | 验证状态 |
| --- | --- | --- | --- | --- |
| `/` | 默认列表、完整搜索结果、类型/分类/排序/分页入口 | `q` `type` `category` `sort` `page` | 动态读取 `searchParams` | contract 与代码一致 |
| `/category/[category]` | 固定分类上下文下的列表页 | `type` `sort` `page` | 动态读取 `params` + `searchParams` | contract 与代码一致 |
| `/skill/[slug]` | 已发布条目详情页 | 无列表型查询参数要求 | `generateStaticParams()` + `revalidate = 3600` | contract 与代码一致 |
| `/about` | 项目说明页 | 无 | 无动态参数；内容来自 Markdown 文件 | contract 与代码结构一致；本次已通过 `verify` 链路内的 `next build` 重新验证静态产物生成 |

## 首页 `/`

### 已被代码验证

- 首页承载完整搜索结果，没有独立 `/search` 路由
- 读取并解析：
  - `q`
  - `type`
  - `category`
  - `sort`
  - `page`
- 顶部搜索框和 Hero 搜索框都提交到 `/`
- 分类卡片从首页跳到 `/category/[category]`
- 列表页在 URL 层保留筛选、排序和分页状态

### 参数规则

- 非法 `type`、`category`、`sort`、`page` 不会生成新路由；会回退到安全默认值
- `q` 会先 trim，再把连续空白归一化
- 空 `q` 等价于默认列表态

## 分类页 `/category/[category]`

### 已被代码验证

- 分类只由路径决定
- 非法分类 slug 直接 `notFound()`
- 页内目录筛选表单不提供分类选择器
- 分类页解析器会固定 `category`，并忽略查询里的 `q`

### 结果行为

- 页面仍复用目录列表、类型筛选、排序和分页
- 分类页顶部会显示当前分类标签与结果数
- 如果用户在全局 Header 发起搜索，搜索表单仍然提交到 `/?q=...`，不会停留在当前分类页

## 详情页 `/skill/[slug]`

### 已被代码验证

- `generateStaticParams()` 只为已发布 slug 生成静态参数
- `getSkillBySlug()` 只查询 `published`
- slug 不存在或记录未发布时返回 404
- 页面按当前代码分成：
  - 基础信息区
  - 详细描述区
  - 集成信息区
  - 外部链接区

### 可见字段边界

- 外部链接区当前只公开：
  - `doc_url`
  - `github_url`
- `source_url`、`source_kind` 仍留在内部治理层，不在详情页公开

## 搜索流转

### 已被代码验证

- 全站统一搜索表单使用 `method="get"` 提交
- 提交目标统一为 `/`
- 首页搜索结果通过 `/?q=` 呈现
- 搜索范围覆盖：
  - `name`
  - `summary`
  - `description`
  - `tags`

### 当前实现细节

- `tags` 在数据库里是 JSON 文本，因此当前搜索本质上是对 JSON 文本做 `LIKE`
- 多个词会按空白拆开，形成“逐词必须命中、每词可命中多个字段之一”的条件组合
- 当前没有：
  - 搜索建议
  - 防抖
  - 高亮片段
  - FTS5
  - `/api/skills/search`

## 404 规则

- 非法分类 slug：分类页直接 404
- 不存在或未发布 slug：详情页直接 404
- 非法查询参数：首页和分类页回退为默认安全值，不走 404

## Contract 对照结论

以下高风险点已经被当前代码验证，没有发现明显冲突：

- 首页承载完整搜索结果
- 分类页不允许页内切换分类
- 搜索统一走 `/?q=`
- 页面直接调用查询层，不经过内部 API
- 详情页对未发布条目返回 404
