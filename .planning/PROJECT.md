# PowerUp Brownfield Frame

## 项目定位

- 这是一个已经开发中的 brownfield 项目，不是 greenfield 初始化目标。
- 当前工作区仓库根：`/home/carl/PowerUp`
- 当前工作区唯一应用根：`/home/carl/PowerUp/site`

严禁把仓库根误判为 Next.js 应用根，也不要再对本仓库执行 `gsd-new-project` 一类初始化流程。

## 目录职责

- `site/`
  - 当前真实应用代码、路由、查询、数据库、内容文件和本地开发命令
- `specs-v1/`
  - 产品规格与 contract 层；`specs-v1/_history/` 下保留历史 walkthrough
- `docs/`
  - 当前实现说明、当前边界、开发说明、真源说明、漂移说明
- `.planning/`
  - GSD 运营层，只放后续工作框架、约束和路线

## 推荐读序

1. `AGENTS.md`
2. `README.md`
3. `docs/README.md`
4. `docs/CURRENT-STATE.md`
5. `docs/ARCHITECTURE.md`
6. `docs/ROUTING-RENDER-SEARCH.md`
7. `docs/DATA-AND-CONTENT.md`
8. `docs/DEVELOPMENT.md`
9. `docs/DRIFT-AND-SOURCES-OF-TRUTH.md`
10. `.planning/PROJECT.md`
11. `.planning/ROADMAP.md`
12. `specs-v1/README.md`
13. `specs-v1/PRD.md`
14. `specs-v1/terms-and-directory-contract.md`
15. `specs-v1/routing-render-search-contract.md`

如果要编辑 `site/**`，再补读 `site/AGENTS.md`。

## 真源优先级

1. `site/src/app/**`
2. `site/src/lib/**`
3. `site/src/db/**`
4. `site/src/types/**`
5. `docs/**`
6. `specs-v1/terms-and-directory-contract.md`
7. `specs-v1/routing-render-search-contract.md`
8. `specs-v1/PRD.md`
9. `site/README.md` 仅作运行手册
10. `specs-v1/_history/walkthrough*.md` 仅作历史/提示

## 当前稳定判断

- 当前实现是一个单应用 Next.js 目录站
- 主链路是 `app -> validation/query -> db`
- 没有内部 API 层
- 没有后台系统
- 没有复杂外部集成
- `.planning/**` 当前只具备最小执行层骨架，不要假设 `.planning/phases/**` 已存在

## 文档层边界

- `specs-v1/` 不负责记录当前实现快照
- `docs/` 不复述 PRD
- `.planning/PROJECT.md` 不是产品介绍页
- `.planning/**` 不是当前实现真源；`.planning/codebase/**` 只是执行层扫描产物
- 发现 specs 与代码漂移时，先记到 `docs/DRIFT-AND-SOURCES-OF-TRUTH.md`

## 禁止误判项

- 不要把 `site/README.md` 或 `specs-v1/_history/walkthroughV2.md` 当当前实现真源
- 不要删除、重置或忽略 `.planning/config.json`
- 不要删除、重置或忽略 `.planning/STATE.md`
- 不要创建 `.planning/research/**`
- 除非当前任务明确要求，否则不要把改动随意扩大到 `specs-v1/**` 或 `site/**`
