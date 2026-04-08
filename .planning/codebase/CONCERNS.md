# 风险与关注点

**分析日期：** 2026-04-07

## 高优先级关注点

### 1. 文档与代码已经出现局部漂移

- `site/README.md` 仍把 `T3-01` 表述为“下一步要做”，但查询层和页面已经存在：
  - `site/src/lib/queries/skills.ts`
  - `site/src/app/page.tsx`
  - `site/src/app/category/[category]/page.tsx`
  - `site/src/app/skill/[slug]/page.tsx`
  - `site/src/app/about/page.tsx`
- `specs-v1/walkthroughV2.md` 的“当前真正缺的不是底层”一节仍说“还没有查询层、首页、详情页、分类页、关于页”，这与当前代码状态不符
- 但两份 contract 文档本身仍然大体可信：
  - `specs-v1/terms-and-directory-contract.md`
  - `specs-v1/routing-render-search-contract.md`

### 2. 自动化测试与 CI 缺失

- 没有测试脚本
- 没有测试目录
- 没有 CI workflow
- 这会让 URL 驱动的列表、搜索、404 行为在后续迭代中更容易回归

### 3. 发布链路没有沉淀到仓库

- 没有发现：
  - `.github/workflows/*`
  - `Dockerfile`
  - `docker-compose.yml`
  - `vercel.json`
  - `netlify.toml`
  - `Procfile`
- 这意味着“如何稳定发布”目前不是仓库内可审计事实

### 4. GSD 产物默认不会被 git 忽略

- 仓库根没有 `.gitignore`
- 当前创建 `.planning/` 后，`git status --short` 显示 `?? .planning/`
- 这不是代码问题，但对 GSD 标准接入有实际影响：
  - 映射、计划、状态文件会直接污染工作树
  - 如果团队不想跟踪 `.planning/**`，需要显式决定忽略策略

## 中优先级关注点

### 5. 数据库和运行环境仍偏本地开发模式

- 当前运行依赖可写本地文件系统上的 SQLite：
  - `site/data/powerup.db`
- `site/src/db/index.ts` 直接在运行时创建目录并打开本地文件
- 这对 MVP 很合适，但对多人协作、部署一致性和生产迁移要额外留意

### 6. `db:push --force` 需要边界意识

- `site/package.json` 的 `db:push` 是 `drizzle-kit push --force`
- 对本地 MVP 很省事
- 但如果有人把这个脚本沿用到更正式环境，会存在误操作风险

### 7. 搜索实现符合 V1，但扩展性有限

- `site/src/lib/queries/skills.ts` 当前使用普通 `LIKE` 匹配：
  - `name`
  - `summary`
  - `description`
  - `tags`
- `tags` 实际存的是 JSON 文本，因此搜索是“对 JSON 文本做模糊匹配”
- 对 18 条样本数据完全足够，但并不适合直接外推到更大规模目录

## 低优先级关注点

### 8. 依赖与实现可能有轻微超配

- 依赖里有 `shiki`
- 但当前已检查到的详情代码路径主要使用：
  - `site/src/components/skill/code-block.tsx`
  - `site/src/components/skill/markdown-renderer.tsx`
- 这不一定是问题，但说明部分能力可能处于“已安装、未成为核心路径”的状态

### 9. `docs/` 目录没有发挥作用

- 仓库根有 `docs/`
- 但当前为空
- 团队知识实际上散落在 `specs-v1/` 与代码实现中

## Brownfield 判断

- 这不是“文档失效、代码失控”的维护噩梦仓库
- 它更像“规格先行、实现已追上，但文档状态快照没及时同步”的持续迭代项目
- 因此最合理的动作不是重写原文档，而是先把漂移显式标出来，再决定是否做标准化接入

## 结论

- 当前最大的真实风险不是技术栈选错，而是：
  - 文档快照过期
  - 缺少自动化验证
  - GSD 产物未被根级忽略
- 这些问题都适合先通过 brownfield 映射和接入策略决策解决，不适合直接跳到“重构”或“重新初始化”。
