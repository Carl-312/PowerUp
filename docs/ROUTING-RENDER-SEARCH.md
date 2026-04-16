# Routing, Render, Search

本文说明当前真实路由、渲染方式、URL 参数规则、搜索流转和错误边界。

## 2026-04-11 重新验证到的路由

| 路由 | 当前职责 | 当前渲染方式 | 主要参数 / 返回 |
| --- | --- | --- | --- |
| `/` | 首页、完整目录、搜索与筛选入口 | 动态读取 `searchParams` | `q` `type` `category` `sort` `page` |
| `/category/[category]` | 固定分类目录页 | 动态读取 `params` + `searchParams` | `type` `sort` `page` |
| `/skill/[slug]` | 已发布条目详情 | `generateStaticParams()` + `revalidate = 3600` | `slug` |
| `/about` | 目录说明页 | 静态页面 | 无 |
| `/api/v1/skills` | 目录列表 API | 动态 Route Handler | `q` `type` `category` `sort` `page` |
| `/api/v1/skills/[slug]` | 详情 API | 动态 Route Handler | `slug` |
| `/api/v1/categories` | 分类统计 API | 动态 Route Handler | 无 |
| `/api/v1/content/about` | About 内容 API | 动态 Route Handler | 无 |

## 首页 `/`

- 顶部搜索和 Hero 搜索都使用 GET 提交到 `/`
- 首页承担完整目录结果态，没有独立 `/search` 页面
- 可解析参数：
  - `q`
  - `type`
  - `category`
  - `sort`
  - `page`
- 非法参数不会 404，而是回退到安全默认值

## 分类页 `/category/[category]`

- 分类由路径固定，不允许通过页内表单切换分类
- 页内只保留：
  - `type`
  - `sort`
  - `page`
- 分类页解析器会忽略查询里的 `q`
- 非法分类 slug 直接 404
- 如果用户从全站 Header 发起搜索，请求会回到首页 `/?q=...`

## 详情页 `/skill/[slug]`

- 只对已发布 slug 生成静态参数
- 只对已发布条目返回详情
- 不存在或未发布 slug 返回 404
- 当前详情页可按数据情况显示：
  - 详细描述
  - 接入与配置
  - 基础信息与目录定位
  - 外部入口
  - 继续探索

## 搜索行为

- 搜索范围覆盖：
  - `name`
  - `summary`
  - `description`
  - `tags`
- `q` 会先 trim，再把连续空白归一化
- 多个词按空白拆分；每个词都必须命中至少一个字段
- `tags` 在数据库里是 JSON 文本，所以当前搜索本质上仍是 `LIKE`

## 列表与分页行为

- 列表只显示 `review_status = "published"` 的条目
- 默认排序是 `updated_desc`
- 备选排序是 `name_asc`
- 默认每页 24 条
- 分类页和首页共用同一套查询层，只是分类页固定了 category 上下文

## 错误边界

- 页面层：
  - 非法分类 slug：404
  - 不存在或未发布 slug：404
  - 非法查询参数：安全回退，不 404
- API 层：
  - 不存在或未发布 slug：返回 404 JSON，错误码 `skill_not_found`
  - 其他异常：返回 500 JSON
