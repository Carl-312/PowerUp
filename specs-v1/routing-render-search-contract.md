# PowerUp V1 路由、渲染与搜索契约

本文是 `T0-02` 的单一真源，用于冻结页面路由职责、渲染策略、数据流边界和搜索流转方式。后续 `site/` 初始化完成后，相关实现必须按本文落地，避免在 `PRD.md`、`walkthrough.md` 和源码中出现多套口径。

---

## 1. 作用范围

- 适用目录：`E:\cursorproject\PowerUp\specs-v1` 与未来的 `E:\cursorproject\PowerUp\site`。
- 若 `PRD.md`、`walkthrough.md`、代码注释与本文冲突，以本文为准，并同步回写冲突文案。
- 本文冻结的是“页面职责和流转边界”，不是组件视觉设计稿；涉及路由、查询入口、页面渲染模式时，以本文为准。

---

## 2. 路由职责

| 路由 | 页面职责 | 允许的 URL 参数 | 非法访问处理 |
| --- | --- | --- | --- |
| `/` | 全站发现入口，承载默认列表、筛选、排序、分页和完整搜索结果 | `q`、`type`、`category`、`sort`、`page` | 参数非法时回退到默认安全值，不创建新路由 |
| `/skill/[slug]` | 单个条目的详情页，只展示公开字段 | 无列表型查询参数要求 | 条目不存在或未发布时返回 404 |
| `/category/[category]` | 固定分类上下文下的列表页，复用首页列表体验 | `type`、`sort`、`page` | 分类 slug 非法时返回 404 |
| `/about` | 项目介绍与联系说明页 | 无 | 路由固定，不承载搜索结果或列表状态 |

- 首页是完整搜索结果的唯一承载页，不新增 `/search` 路由。
- 分类页的分类上下文只由路径决定，不接受额外 `category` 查询参数覆盖。
- 全站任意搜索提交都回到首页结果态 `/?q=关键词`，而不是留在 `/category/[category]` 或 `/about`。

---

## 3. 渲染策略

| 路由 | 渲染模式 | 锁定决策 |
| --- | --- | --- |
| `/` | 动态页面 | 读取 `searchParams` 作为筛选、排序、分页和搜索结果输入 |
| `/category/[category]` | 动态页面 | 同时依赖 `params.category` 和 `searchParams` |
| `/skill/[slug]` | 静态参数 + 定时再验证 | 使用 `generateStaticParams` 预生成已知已发布 slug，并设置 `revalidate` |
| `/about` | 静态页面 | 作为稳定、可索引的说明页输出 |

- `layout.tsx` 不读取 `searchParams`，避免把全局壳层错误地拖入动态渲染。
- `generateStaticParams` 只用于 `/skill/[slug]`，不能用于 `/` 或 `/category/[category]`。
- 详情页即使使用静态参数预生成，也必须在运行时对“未发布 / 不存在”返回 404。

---

## 4. 数据流边界

- 页面组件优先直接调用服务端查询层，不通过内部 HTTP API 再绕一层。
- 后续服务端查询层的目标位置固定为 `site/src/lib/queries/skills.ts` 等查询模块。
- 当前 V1 不要求任何公开 API；如未来出现外部复用或前端增强需求，再单独补：
  - `/api/skills`
  - `/api/skills/[slug]`
  - `/api/categories`
  - `/api/skills/search`
- 禁止在服务端页面内部通过 `fetch("/api/...")` 或站内绝对地址再次请求自己站点的数据接口。

---

## 5. 搜索流转

1. 顶部导航搜索框和首页 Hero 搜索框共用同一套行为契约。
2. 当前 V1 的两处搜索框都使用普通 GET 表单提交到 `/?q=关键词`。
3. 用户按回车或点击提交后，跳转到 `/?q=关键词`，完整结果复用首页列表态。
4. 搜索结果只包含 `published` 状态条目。
5. 搜索词为空时，不发起专用搜索请求，页面回到默认列表态。

- Header 与 Hero 只能共享一套搜索行为，不允许各自维护不同的提交入口或跳转规则。
- 搜索结果页不是新页面，而是首页在 `q` 条件下的一个状态。

---

## 6. 后续代码落点

- 首页：`site/src/app/page.tsx`
- 详情页：`site/src/app/skill/[slug]/page.tsx`
- 分类页：`site/src/app/category/[category]/page.tsx`
- 关于页：`site/src/app/about/page.tsx`
- 查询层：`site/src/lib/queries/skills.ts`

---

## 7. 执行约束

- 不新增独立 `/search` 页面或 `/search/[keyword]` 路由。
- 不让首页或分类页通过 `generateStaticParams` 假装静态化。
- 不让分类页接受路径外的分类切换能力。
- 不让服务端页面请求自己站内 API。
- 验收时应能从文档和实现中唯一回答四个问题：哪一页承载完整搜索结果、哪一页动态、哪一页静态、搜索提交后回到哪个路由。
