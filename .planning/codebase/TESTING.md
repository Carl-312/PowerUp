# 测试与验证

**分析日期：** 2026-04-07

## 已观察到的质量入口

- `site/package.json` 里有这些可用于本地验证的脚本：
  - `lint`
  - `typecheck`
  - `build`
  - `db:generate`
  - `db:push`
  - `db:seed`
  - `db:studio`
- 这些脚本说明项目已经具备“本地开发自检”的最小骨架，但还不是完整自动化测试体系

## 明确缺失的自动化测试

- 没有发现 `test` 脚本
- 没有发现 `vitest`、`jest`、`playwright`、`cypress` 等测试框架配置
- 没有发现 `tests/`、`__tests__/`、`e2e/` 或同类目录
- 没有发现 `.github/workflows/*` 之类 CI 配置

## 现阶段更像什么

- 当前质量保障主要依赖：
  - 类型检查
  - lint
  - 构建通过
  - 人工 smoke check
  - 本地数据库脚本
- README 与 `specs-v1/walkthroughV2.md` 都声称某些命令已被验证过，例如：
  - `npx tsc --noEmit`
  - `npm run build`
  - `npm run db:push`
  - `npm run db:seed`
- 但这些结论目前没有在仓库内形成可重复执行的 CI 证据链

## 应重点补的测试面

### 查询层

- `site/src/lib/queries/skills.ts`
- 需要覆盖：
  - 只返回 `published`
  - 搜索 `q` 的分词匹配
  - `type` / `category` / `sort` / `page` 组合
  - 分页边界

### 参数解析

- `site/src/lib/validation.ts`
- 需要覆盖：
  - 非法 `page`
  - 非法 `sort`
  - 非法 `type`
  - 分类页忽略 `q`

### 页面行为 smoke

- `/`
- `/category/[category]`
- `/skill/[slug]`
- `/about`
- 需要覆盖：
  - 404 分支
  - 搜索表单回到首页
  - 分类页锁定分类上下文

### 数据脚本

- `site/src/db/seed.ts`
- 需要验证：
  - seed 幂等
  - 重跑不会产生重复 slug

## 当前测试风险

- 搜索、分页、404 和详情页渲染都属于“容易被小改动打断”的路径
- 但仓库中没有自动化回归网
- 没有 CI，意味着即使本地有人跑过，也无法确保团队后续每次改动都重复验证

## 本次 map 的边界

- 本次代码库映射没有执行 `build`、`typecheck` 或数据库写操作
- 原因不是不能执行，而是当前用户约束要求默认只写 `.planning/**`，避免在 `site/` 生成额外产物

## 结论

- 这个项目已经有“可验证命令”，但还没有“自动化测试体系”。
- 在 brownfield 语境里，它更像一个依赖人工回归和本地脚本的站点，而不是成熟的测试驱动工程。
