# PowerUp Brownfield Frame

## 项目定位

- 这是一个已经开发中的 brownfield 项目，不是 greenfield 初始化目标。
- 仓库根：`E:\cursorproject\PowerUp`
- 唯一应用根：`E:\cursorproject\PowerUp\site`

严禁把仓库根误判为 Next.js 应用根，也不要再对本仓库执行 `gsd-new-project` 一类初始化流程。

## 目录职责

- `site/`
  - 当前真实应用代码、路由、查询、数据库、内容文件和本地开发命令
- `specs-v1/`
  - 产品规格与 contract 层
- `docs/`
  - 当前实现说明、当前边界、开发说明、真源说明、漂移说明
- `.planning/`
  - GSD 运营层，只放后续工作框架、约束和路线

## 真源优先级

1. `site/src/app/**`
2. `site/src/lib/queries/**`
3. `site/src/lib/validation.ts`
4. `site/src/db/**`
5. `site/src/types/skill.ts`
6. `.planning/codebase/**`
7. `specs-v1/terms-and-directory-contract.md`
8. `specs-v1/routing-render-search-contract.md`
9. `specs-v1/PRD.md`
10. `specs-v1/walkthroughV2.md` 与 `site/README.md` 仅作历史/提示

## 当前稳定判断

- 当前实现是一个单应用 Next.js 目录站
- 主链路是 `app -> validation/query -> db`
- 没有内部 API 层
- 没有后台系统
- 没有复杂外部集成

## 文档层边界

- `specs-v1/` 不负责记录当前实现快照
- `docs/` 不复述 PRD
- `.planning/PROJECT.md` 不是产品介绍页
- 发现 specs 与代码漂移时，先记到 `docs/DRIFT-AND-SOURCES-OF-TRUTH.md`

## 禁止误判项

- 不要把 `site/README.md` 或 `specs-v1/walkthroughV2.md` 当当前实现真源
- 不要创建 `.planning/config.json`
- 不要创建 `.planning/STATE.md`
- 不要创建 `.planning/research/**`
- 不要在未获明确授权前修改 `specs-v1/**` 或 `site/**`
