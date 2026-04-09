# Forward-Only Roadmap

本文只记录当前基线之后仍值得推进的 phase，不补建历史 V1 phase，也不把已经落地的基线能力重新写成待办。

## 当前基线

- 目录站主路径已经存在：首页、分类页、详情页、关于页、查询层、参数校验层、SQLite/Drizzle 数据层
- `npm run verify`、页面级 smoke 与最小 CI 已建立
- `docs/**` 已建立当前实现说明与漂移记录
- `specs-v1/_history/` 已完成 walkthrough 正文硬归档；根级 `walkthrough*.md` 只保留跳转桩
- `.planning/**` 仍是最小执行层骨架，不把已完成基线反复重开成新 phase

以下两项视为已具备的基础前置，不默认重新立项：

- Phase 1: automation-validation 自动化验证基线
- Phase 2: 构建与交付验证收口

## Phase 3: 文档治理持续收口

- 目标
  - 继续降低 README / walkthrough / `.planning` 口径漂移对后续 agent 的误导风险
- 范围
  - 统一 repo 入口顺序
  - 继续维护 `docs/**` 与 `specs-v1/**` 的角色边界
  - 修正失效引用、错误路径、错误命令和会误导当前实现判断的旧表述
- 非目标
  - 不重写 `specs-v1/PRD.md`
  - 不把 `_history/**` 回升为默认入口
  - 不为了“整齐”重写已经正确的文档

## Phase 4: 受控后续增强

- 目标
  - 在不破坏当前 contract 的前提下推进后续需求
- 候选方向
  - 搜索增强
  - 文档治理自动化
  - 更稳的发布说明
- 前提
  - 必须先保持 Phase 3 的边界收口稳定
