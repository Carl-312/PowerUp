# PowerUp V1 文档归档记录

> 状态更新（2026-04-08）：
> - 阶段一软归档：已完成
> - 阶段二硬归档：已完成
> - walkthrough 正文已迁入 `specs-v1/_history/`
> - 原位置 `specs-v1/walkthrough*.md` 现为短跳转桩
> - `docs/**` 已成为当前实现说明层
> - `site/README.md` 已收口为运行手册
> - `.planning/**` 已收口为执行层，不再承担当前实现说明职责

本文保留为治理记录，不再是待执行方案。

## 最终分层

- 当前实现文档
  - `docs/README.md`
  - `docs/CURRENT-STATE.md`
  - `docs/ARCHITECTURE.md`
  - `docs/ROUTING-RENDER-SEARCH.md`
  - `docs/DATA-AND-CONTENT.md`
  - `docs/DEVELOPMENT.md`
  - `docs/DRIFT-AND-SOURCES-OF-TRUTH.md`
- contract / PRD
  - `specs-v1/README.md`
  - `specs-v1/PRD.md`
  - `specs-v1/terms-and-directory-contract.md`
  - `specs-v1/routing-render-search-contract.md`
- 运行手册
  - `site/README.md`
- 历史归档
  - `specs-v1/_history/walkthrough.md`
  - `specs-v1/_history/walkthroughV2.md`
  - 根级 `specs-v1/walkthrough*.md` 只作跳转桩
- GSD 执行层
  - `.planning/PROJECT.md`
  - `.planning/ROADMAP.md`
  - `.planning/STATE.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/codebase/**` 只作扫描产物

## 默认入口顺序

后续人和 agent 的默认入口固定为：

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

## 已完成的治理动作

- 仓库根新增并固定 `README.md` 作为入口文档
- `docs/**` 被固定为当前实现说明层
- `specs-v1/**` 被收束为 PRD / contract 层
- walkthrough 正文迁入 `_history/`，原位置保留短跳转桩
- `site/README.md` 从“阶段说明”收口为运行手册
- `.planning/PROJECT.md`、`.planning/ROADMAP.md` 改为执行层语义

## 后续维护规则

- 新的当前实现说明优先写到 `docs/**`
- `specs-v1/**` 继续负责产品目标与 contract，不回写当前实现快照
- `site/README.md` 继续只写运行、验证、数据库与子目录提示
- `.planning/**` 继续只承担执行层职责，不和 `docs/**` 混写
- 不把 `_history/**` 回升为默认入口
- 发现旧文档与代码漂移时，先更新 `docs/DRIFT-AND-SOURCES-OF-TRUTH.md`

## 当前仍需留意的非阻塞项

- 继续保持根级 README、`AGENTS.md`、`docs/**`、`specs-v1/**` 的入口顺序一致
- 继续防止 PRD 中的目标态表述被误读成“当前 UI 已全部落地”
- 每次修改文档后，都重新核对相关路径、命令、引用链与 `npm run verify` 结果
