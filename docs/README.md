# PowerUp Docs

本目录只负责描述当前实现、当前边界、开发运行方式，以及规格与实现之间的漂移。

## 仓库分层

- `site/`
  当前 Next.js 运行根。保留现有页面、查询逻辑、数据库定义和验证命令，同时现在也承载 `api/v1`。
- `frontendv2/`
  独立前端工作区。只消费 `site` 暴露的 API，当前已具备首页/分类/详情/关于页和一轮视觉、性能打磨，可继续作为正式前端迁移基线。
- `shared/`
  前后端共享 taxonomy 与 API contract，不放数据库访问逻辑。
- `specs-v1/`
  V1 产品规格与 contract 层。`specs-v1/_history/` 下保留 walkthrough 历史文档。
- `docs/`
  当前实现说明层。这里记录代码已实现的行为、当前边界、开发说明和漂移判断，不复述完整 PRD。
- `.planning/`
  GSD 运营层。只放后续自动化工作需要的项目框架、约束和路线，不承担产品介绍或 PRD 镜像职责。

## 先看什么

1. [CURRENT-STATE.md](./CURRENT-STATE.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [FRONTEND-V2-SEPARATION.md](./FRONTEND-V2-SEPARATION.md)
4. [FRONTEND-V2-MIGRATION-PROMPT.md](./FRONTEND-V2-MIGRATION-PROMPT.md)
5. [ROUTING-RENDER-SEARCH.md](./ROUTING-RENDER-SEARCH.md)
6. [DATA-AND-CONTENT.md](./DATA-AND-CONTENT.md)
7. [DEVELOPMENT.md](./DEVELOPMENT.md)
8. [DRIFT-AND-SOURCES-OF-TRUTH.md](./DRIFT-AND-SOURCES-OF-TRUTH.md)

如果还需要补产品/contract 上下文，继续读：

7. `../specs-v1/README.md`
8. `../specs-v1/PRD.md`
9. `../specs-v1/terms-and-directory-contract.md`
10. `../specs-v1/routing-render-search-contract.md`

## 真源优先级

当前实现判断优先依据真实代码与 `docs/**`，不以 README、walkthrough 或 `.planning/**` 的扫描产物替代代码事实。

### 当前实现真源

1. `site/src/app/**`
2. `site/src/lib/**`
3. `site/src/db/**`
4. `site/src/types/**`
5. `shared/**`
6. `frontendv2/src/**`
7. `docs/**`

### contract / 产品层参考

6. `specs-v1/terms-and-directory-contract.md`
7. `specs-v1/routing-render-search-contract.md`
8. `specs-v1/PRD.md`

### 运行 / 历史 / 执行辅助

9. `site/README.md` 只作运行手册
10. `specs-v1/_history/walkthrough*.md` 只作历史记录
11. `.planning/**` 只作 GSD 执行层；其中 `.planning/codebase/**` 是扫描产物，不是当前实现真源

## 使用边界

- 不要把仓库根当成单一应用根。旧站命令从 `site/` 执行，新前端命令从 `frontendv2/` 执行。
- 不要让 `frontendv2/` 重新直连 `site/src/db/**` 或 `site/src/lib/queries/**`。
- 如果目标是逐步替换正式前端，优先沿着 `FRONTEND-V2-SEPARATION.md` 与 `FRONTEND-V2-MIGRATION-PROMPT.md` 的迁移顺序推进，而不是回到一次性重写思路。
- 不要把 `docs/` 写成 `specs-v1/PRD.md` 的镜像。
- 发现 specs 与代码漂移时，先记录到 [DRIFT-AND-SOURCES-OF-TRUTH.md](./DRIFT-AND-SOURCES-OF-TRUTH.md)，不要默认回写 `specs-v1/**`。
- 本目录内容以本次静态读码和只读核对为基础；未重新执行的命令会明确标注为“未在本次任务中再次验证”。
