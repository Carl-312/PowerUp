# Forward-Only Roadmap

本文只记录从当前状态往后的少量 phase，不补建历史 V1 phase，也不把已完成实现重新写成计划项。

## 当前起点

- 目录站主路径已经存在：首页、分类页、详情页、关于页、查询层、参数校验层、SQLite/Drizzle 数据层
- `docs/**` 已建立当前实现说明与漂移记录
- 当前主要缺口集中在自动化验证、漂移收敛和后续受控接入

## Phase 1: automation-validation 自动化验证基线

- 目标
  - 为现有实现补最小自动化回归网
- 范围
  - `validation.ts` 参数解析测试
  - `queries/skills.ts` 查询与 `published` 可见性测试
  - 首页 / 分类页 / 详情页 / 关于页的基础 smoke
- 非目标
  - 不引入大规模测试基础设施重构

## Phase 2: 构建与交付验证收口

- 目标
  - 把当前人工验证入口收敛成稳定的本地/CI 验证链
- 范围
  - 固化 `lint`、`typecheck`、`build` 的执行顺序
  - 补最小 CI
  - 明确本地 SQLite 与 `db:push --force` 的使用边界
- 非目标
  - 不在此阶段扩展产品能力

## Phase 3: 文档漂移持续收敛

- 目标
  - 降低 README / walkthrough 继续误导后续 agent 的风险
- 范围
  - 继续以 `docs/**` 为主维护当前实现说明
  - 仅在明确授权下，对非 contract 的旧说明做最小提示性修正或归档策略
- 非目标
  - 不重写 `specs-v1/PRD.md`

## Phase 4: 受控后续增强

- 目标
  - 在不破坏当前 contract 的前提下推进后续需求
- 候选方向
  - 搜索增强
  - 文档治理自动化
  - 更稳的发布说明
- 前提
  - 必须先通过前面 phase 的验证与边界收口
