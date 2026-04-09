# PowerUp

**产品名称：** PowerUp

- **一句话描述：** 给你的 AI Agent 吃个蘑菇 🍄 — 发现、选择、接入，一站搞定 Agent 能力扩展。
- **产品定位：**开放共建的 Agent 能力发现平台。PowerUp 从精选起步，向社区生长 — 让非技术用户零门槛探索，让好用的AI工具被更多人发现和分享。

`/home/carl/PowerUp` 是仓库根协调层，不是单一应用根。
当前仓库已经拆成“后端/BFF + 独立前端重构工作区”的双入口结构：

- [`site/`](./site/)：当前 Next.js 运行根，承载现有页面、SQLite/Drizzle 数据层和 `api/v1`
- [`frontendv2/`](./frontendv2/)：新的独立前端工作区，只消费 `site` 暴露的 API，现已具备可继续迁移到正式前端的独立基线
- [`shared/`](./shared/)：前后端共享 taxonomy 与 API contract

## For Humans

### 项目是什么

PowerUp 当前仓库主要承载 7 层内容：

| 区域 | 作用 |
| --- | --- |
| [`site/`](./site/) | 当前 Next.js 运行根，包含现有页面、`api/v1`、SQLite + Drizzle 数据层、测试与构建脚本 |
| [`frontendv2/`](./frontendv2/) | 独立前端重构工作区，使用 API-first 方式消费目录数据 |
| [`shared/`](./shared/) | 前后端共享 taxonomy 与 API contract |
| [`docs/`](./docs/) | 当前实现说明层，优先回答“现在代码已经做了什么” |
| [`specs-v1/`](./specs-v1/) | V1 的 PRD 与 contract 层，负责目标、约束和术语冻结 |
| [`specs-v1/_history/`](./specs-v1/_history/) | walkthrough 历史归档层，只回看历史决策，不作为当前实现真源 |
| [`.planning/`](./.planning/) | GSD 执行层，负责后续 phase、要求和状态，不负责当前实现说明 |

### 快速导航

| 你想看什么 | 去哪里 |
| --- | --- |
| 当前实现与当前边界 | [`docs/README.md`](./docs/README.md) |
| 当前系统状态 | [`docs/CURRENT-STATE.md`](./docs/CURRENT-STATE.md) |
| 架构、路由、数据、前后端拆分与开发方式 | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)、[`docs/FRONTEND-V2-SEPARATION.md`](./docs/FRONTEND-V2-SEPARATION.md)、[`docs/FRONTEND-V2-MIGRATION-PROMPT.md`](./docs/FRONTEND-V2-MIGRATION-PROMPT.md)、[`docs/ROUTING-RENDER-SEARCH.md`](./docs/ROUTING-RENDER-SEARCH.md)、[`docs/DATA-AND-CONTENT.md`](./docs/DATA-AND-CONTENT.md)、[`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) |
| 产品目标与 contract | [`specs-v1/README.md`](./specs-v1/README.md) |
| 本地运行与验证命令 | [`site/README.md`](./site/README.md)、[`frontendv2/README.md`](./frontendv2/README.md) |
| 文档归档与治理记录 | [`V1-DOC-ARCHIVE-PLAN.md`](./V1-DOC-ARCHIVE-PLAN.md) |
| 历史 walkthrough | [`specs-v1/_history/`](./specs-v1/_history/) |

### Quick Start

从后端/BFF 根 [`site/`](./site/) 执行：

```bash
cd site
npm install
npm run verify
```

如果你只是想理解当前仓库状态，不要先从 `site/README.md` 或历史 walkthrough 开始，先看 [`docs/`](./docs/)。
如果你要继续推进独立前端或逐步迁移正式前端，则优先看 [`frontendv2/`](./frontendv2/)、[`docs/FRONTEND-V2-SEPARATION.md`](./docs/FRONTEND-V2-SEPARATION.md) 和 [`docs/FRONTEND-V2-MIGRATION-PROMPT.md`](./docs/FRONTEND-V2-MIGRATION-PROMPT.md)。

### 历史文档说明

- walkthrough 正文已经迁到 [`specs-v1/_history/walkthrough.md`](./specs-v1/_history/walkthrough.md) 与 [`specs-v1/_history/walkthroughV2.md`](./specs-v1/_history/walkthroughV2.md)
- 根级 [`specs-v1/walkthrough.md`](./specs-v1/walkthrough.md) 与 [`specs-v1/walkthroughV2.md`](./specs-v1/walkthroughV2.md) 现在只是跳转桩
- `_history/**` 可用于回看当时的范围收缩、任务拆分和 backlog 取舍，但不能作为当前实现真源

## For Agents

### Read Order

按下面顺序建立上下文：

1. [`AGENTS.md`](./AGENTS.md)
2. [`README.md`](./README.md)
3. [`docs/README.md`](./docs/README.md)
4. [`docs/CURRENT-STATE.md`](./docs/CURRENT-STATE.md)
5. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
6. [`docs/ROUTING-RENDER-SEARCH.md`](./docs/ROUTING-RENDER-SEARCH.md)
7. [`docs/DATA-AND-CONTENT.md`](./docs/DATA-AND-CONTENT.md)
8. [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md)
9. [`docs/DRIFT-AND-SOURCES-OF-TRUTH.md`](./docs/DRIFT-AND-SOURCES-OF-TRUTH.md)
10. [`.planning/PROJECT.md`](./.planning/PROJECT.md)
11. [`.planning/ROADMAP.md`](./.planning/ROADMAP.md)
12. [`specs-v1/README.md`](./specs-v1/README.md)
13. [`specs-v1/PRD.md`](./specs-v1/PRD.md)
14. [`specs-v1/terms-and-directory-contract.md`](./specs-v1/terms-and-directory-contract.md)
15. [`specs-v1/routing-render-search-contract.md`](./specs-v1/routing-render-search-contract.md)

如果要编辑 [`site/**`](./site/)，再补读 [`site/AGENTS.md`](./site/AGENTS.md)。
如果要重构新前端，补读 [`frontendv2/README.md`](./frontendv2/README.md)、[`docs/FRONTEND-V2-SEPARATION.md`](./docs/FRONTEND-V2-SEPARATION.md) 与 [`docs/FRONTEND-V2-MIGRATION-PROMPT.md`](./docs/FRONTEND-V2-MIGRATION-PROMPT.md)。

### Source Of Truth

当前实现判断优先级：

1. [`site/src/app/**`](./site/src/app)
2. [`site/src/lib/**`](./site/src/lib)
3. [`site/src/db/**`](./site/src/db)
4. [`site/src/types/**`](./site/src/types)
5. [`shared/**`](./shared/)
6. [`frontendv2/src/**`](./frontendv2/src)
7. [`docs/**`](./docs/)

contract / 产品层参考：

8. [`specs-v1/terms-and-directory-contract.md`](./specs-v1/terms-and-directory-contract.md)
9. [`specs-v1/routing-render-search-contract.md`](./specs-v1/routing-render-search-contract.md)
10. [`specs-v1/PRD.md`](./specs-v1/PRD.md)

运行 / 历史 / 执行辅助：

11. [`site/README.md`](./site/README.md) 与 [`frontendv2/README.md`](./frontendv2/README.md) 只作运行手册
12. [`specs-v1/_history/**`](./specs-v1/_history/) 只作历史记录
13. [`.planning/**`](./.planning/) 只作 GSD 执行层；其中 [`.planning/codebase/**`](./.planning/codebase/) 是扫描产物，不是当前实现真源

### Working Rules

- 不要把仓库根当成单一应用根；`site/` 和 `frontendv2/` 现在是不同职责的两个工作区。
- 旧站验证、数据库和 Next.js 命令从 [`site/`](./site/) 执行。
- 新前端重构命令从 [`frontendv2/`](./frontendv2/) 执行。
- 不要把 [`docs/**`](./docs/) 写成 [`specs-v1/PRD.md`](./specs-v1/PRD.md) 的镜像。
- 不要把 [`.planning/**`](./.planning/) 当成当前实现说明层。
- 不要把 [`specs-v1/_history/**`](./specs-v1/_history/) 回升为默认入口。
- 发现 specs、README、walkthrough 与代码漂移时，优先更新 [`docs/DRIFT-AND-SOURCES-OF-TRUTH.md`](./docs/DRIFT-AND-SOURCES-OF-TRUTH.md)。

### Common Validation

从 [`site/`](./site/) 执行：

```bash
npm run lint
npm run test
npm run test:smoke
npm run typecheck
npm run verify
```

从 [`frontendv2/`](./frontendv2/) 执行：

```bash
npm install
npm run typecheck
npm run build
```
