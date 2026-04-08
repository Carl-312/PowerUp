# PowerUp Docs

本目录只负责描述当前实现、当前边界、开发运行方式，以及规格与实现之间的漂移。

## 仓库分层

- `site/`
  当前唯一应用根。所有可运行代码、路由、查询逻辑、数据库定义和本地开发命令都在这里。
- `specs-v1/`
  V1 产品规格与 contract 层。继续承担 PRD、术语/目录 contract、路由/渲染/搜索 contract。
- `docs/`
  当前实现说明层。这里记录代码已实现的行为、当前边界、开发说明和漂移判断，不复述完整 PRD。
- `.planning/`
  GSD 运营层。只放后续自动化工作需要的项目框架、约束和路线，不承担产品介绍或 PRD 镜像职责。

## 先看什么

1. [CURRENT-STATE.md](./CURRENT-STATE.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [ROUTING-RENDER-SEARCH.md](./ROUTING-RENDER-SEARCH.md)
4. [DATA-AND-CONTENT.md](./DATA-AND-CONTENT.md)
5. [DEVELOPMENT.md](./DEVELOPMENT.md)
6. [DRIFT-AND-SOURCES-OF-TRUTH.md](./DRIFT-AND-SOURCES-OF-TRUTH.md)

## 真源优先级

当前实现判断优先依据真实代码，不以 README 或 walkthrough 的旧状态快照为准。

1. `site/src/app/**`
2. `site/src/lib/queries/**`
3. `site/src/lib/validation.ts`
4. `site/src/db/**`
5. `site/src/types/skill.ts`
6. `.planning/codebase/**`
7. `specs-v1/terms-and-directory-contract.md`
8. `specs-v1/routing-render-search-contract.md`
9. `specs-v1/PRD.md`
10. `specs-v1/walkthroughV2.md` 与 `site/README.md` 只作为历史状态和开发提示

## 使用边界

- 不要把仓库根当成应用根。开发、运行、构建和数据库命令都应从 `site/` 执行。
- 不要把 `docs/` 写成 `specs-v1/PRD.md` 的镜像。
- 发现 specs 与代码漂移时，先记录到 [DRIFT-AND-SOURCES-OF-TRUTH.md](./DRIFT-AND-SOURCES-OF-TRUTH.md)，不要默认回写 `specs-v1/**`。
- 本目录内容以本次静态读码和只读核对为基础；未重新执行的命令会明确标注为“未在本次任务中再次验证”。
