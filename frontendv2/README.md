# PowerUp Frontend V2

`frontendv2/` 是为前后端分离准备的独立前端工作区。

它的目标不是替代 `site/` 里的现有 Next.js 页面，而是提供一个可以完全重构的新前端壳层：

- 只消费 `site/` 暴露的 `/api/v1/**`
- 不直接访问 `site/src/db/**`
- 不直接调用 `site/src/lib/queries/**`
- 通过 `../shared/**` 共享公共 taxonomy 和 API contract

## Current Status

当前 `frontendv2/` 已经不再只是最小脚手架，而是一个可继续迭代、可用于迁移演练的独立前端基线：

- 已具备首页、分类页、详情页、关于页 4 个真实页面
- 已通过 route loader + API client 消费 `site/` 暴露的 `/api/v1/**`
- 已补独立导航、目录筛选、分页、错误态与开发 fallback
- 已完成一轮视觉精修
  - 首页 Hero、分类页、详情页的版式与信息层级已经重排
  - Wonder 场景、卡片密度、中文排版与移动端关系已做第一轮打磨
- 已完成一轮前端性能优化
  - 分类页 / 详情页 / About 使用路由级懒加载
  - Markdown 渲染仅在需要的页面加载
  - 非首屏 section 与目录卡片已补延后渲染
  - 字体加载已从 CSS `@import` 调整为 `preconnect + link`

它现在更适合作为“正式前端迁移候选实现”，而不是纯概念稿。

## Local Development

```bash
cd frontendv2
npm install
npm run dev
```

默认开发地址是 `http://127.0.0.1:5173`。

开发时，Vite 会把 `/api/**` 代理到 `http://127.0.0.1:3000`。
如果你的后端不是这个地址，可以在启动前设置：

```bash
POWERUP_BACKEND_ORIGIN=http://127.0.0.1:3001 npm run dev
```

如果你在构建后需要让前端直接请求另一个 API 根地址，可以设置：

```bash
VITE_POWERUP_API_BASE_URL=https://your-backend.example.com/api/v1 npm run build
```

如果后端暂时不可用，开发模式下会自动回退到本地演示数据，避免页面只剩背景或空白错误态。

## Verification

在 `frontendv2/` 目录下：

```bash
npm install
npm run typecheck
npm run build
```

当前推荐至少检查这些页面：

- `/`
- `/category/developer-tools`
- `/skill/everything-mcp`
- `/about`

## What Lives Here

- `src/app/router.tsx`
  - 前端路由和 route loader
- `src/lib/api.ts`
  - 对 `/api/v1` 的统一请求层
- `src/pages/**`
  - 首页、分类页、详情页、关于页
- `src/components/**`
  - App shell、目录控件、卡片、Wonder 场景与 Markdown 渲染组件
- `../shared/powerup-taxonomy.ts`
  - 共享分类和类型定义
- `../shared/powerup-api-contract.ts`
  - 共享 API DTO 契约
- `../docs/FRONTEND-V2-SEPARATION.md`
  - 正式前端迁移的职责边界与推荐顺序
- `../docs/FRONTEND-V2-MIGRATION-PROMPT.md`
  - 可直接复制给 AI 的逐步迁移提示词模板

## Current Boundary

- 这仍然不是最终生产前端，但已经具备继续迁移到正式入口的工程起点
- 当前继续坚持 API-first，不应回退为直接耦合 `site/src/db/**` 或 `site/src/lib/queries/**`
- 如果要逐步替换旧站，优先沿着以下顺序推进：
  - 先对齐 `site/` 与 `frontendv2/` 的 URL、筛选参数与 SEO/metadata 需求
  - 再逐页迁移首页、分类页、详情页、关于页
  - 最后再决定是否将 `site/` 收缩为纯 BFF / API 提供方
