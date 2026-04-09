# Frontend V2 Separation

本文档描述当前前后端分离结构、边界，以及如何逐步把 `frontendv2/` 迁移到正式前端。

## 为什么先拆结构

当前 `site/` 是一个单体 Next.js 目录站：

- 页面直接位于 `site/src/app/**`
- 页面内直接调用 `site/src/lib/queries/skills.ts`
- 查询层直接连接 `site/src/db/**`

这种结构对 MVP 很高效，但会让“前端完全重构”变成一次高风险大手术，因为展示层和数据读取方式绑在一起。

本次调整的核心不是直接推翻旧站，而是先把未来重构需要的边界建立出来：

1. `site/` 提供稳定 JSON API
2. `frontendv2/` 只消费 API
3. `shared/` 承担公共 taxonomy 和 API contract

## 新结构

### `site/`

现在同时承担两层职责：

- 现有 Next.js V1 页面和旧前端
- 作为 `frontendv2/` 的 BFF/API 提供方

本次新增的后端边界：

- `site/src/app/api/v1/skills/route.ts`
- `site/src/app/api/v1/skills/[slug]/route.ts`
- `site/src/app/api/v1/categories/route.ts`
- `site/src/app/api/v1/content/about/route.ts`

### `frontendv2/`

这是新的独立前端工作区，用来承接后续完整重构：

- 使用 Vite + React + React Router
- 只读 `/api/v1/**`
- 不直接 import `site/src/db/**`
- 不直接 import `site/src/lib/queries/**`
- 当前已具备首页、分类页、详情页、关于页的真实页面
- 当前已完成一轮视觉与性能打磨，适合继续用作正式前端迁移基线，而不只是概念验证

### `shared/`

本次新增的共享层只放公共协议，不放运行时数据库逻辑：

- `shared/powerup-taxonomy.ts`
  - 分类 slug / label
  - Skill type / label
- `shared/powerup-api-contract.ts`
  - 前后端共享 DTO 和 envelope 结构

## 当前推荐职责边界

### 后端留在 `site/`

- Drizzle / SQLite schema
- 数据读取与可见性规则
- Next.js Route Handlers
- 内容文档读取

### 前端留在 `frontendv2/`

- 页面布局
- UI 组件
- 交互状态
- 路由与页面级 loader
- API client

### 不应该再发生的耦合

- `frontendv2` 直接调用 `listSkills()`
- `frontendv2` 直接读取 `powerup.db`
- `frontendv2` 直接依赖 Next.js App Router 服务端能力

## API Surface

当前独立前端可依赖的读取接口：

- `GET /api/v1/skills`
  - 目录列表
  - 当前 filters
  - 分页信息
  - 分类统计
- `GET /api/v1/skills/:slug`
  - 公开详情
- `GET /api/v1/categories`
  - 分类统计
- `GET /api/v1/content/about`
  - About Markdown 内容

## 迁移顺序建议

### Phase 1: 结构拆分

- 补 API
- 补共享 contract
- 创建 `frontendv2/`

### Phase 2: 前端视觉与交互重构

- 在 `frontendv2/` 内重做信息架构、视觉系统和组件设计
- 保持 API contract 稳定，避免一边改 UI 一边动数据库

### Phase 3: 逐步迁移正式前端

- 不要直接删掉 `site/` 现有页面
- 优先迁移低耦合、高收益区域：
  - 全局 shell / header / footer
  - 首页目录浏览区
  - 分类页
  - 详情页
  - About 页
- 每一轮都应满足：
  - 范围小
  - 可验证
  - 可回退
  - 不破坏 API-first 边界

### Phase 4: 能力扩展

- 搜索建议
- 更细粒度 API
- 鉴权 / 管理端
- 写接口

### Phase 5: 切换主入口

当 `frontendv2/` 足够成熟后，再决定：

- 是否替换旧 `site/` 页面
- 是否把 `site/` 收缩成纯后端/BFF
- 是否将 `frontendv2/` 部署为独立前端应用

## 当前推荐做法

- 把 `frontendv2/` 当成“迁移候选实现”，不是一次性替换物
- 把 `site/` 当成现有运行根和 BFF/API 提供方
- 每次只搬一个页面或一个模块
- 优先复用 `frontendv2` 已经验证过的布局、组件思想、性能优化和 API client 边界
- 需要复用 AI 工作流时，直接使用 [`FRONTEND-V2-MIGRATION-PROMPT.md`](./FRONTEND-V2-MIGRATION-PROMPT.md)

## 本次验证重点

- `site` 页面仍可工作
- 新 API 可返回稳定 JSON 结构
- `frontendv2` 有独立项目边界和运行说明
- 文档已明确新目录职责
