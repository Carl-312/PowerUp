# Drift And Sources Of Truth

本文用于明确“当前应该信什么”，并把已经识别出的文档漂移固定下来，避免后续 agent 再把过期快照当成当前实现真源。

## 真源优先级

### 当前实现真源

1. `site/src/app/**`
2. `site/src/lib/queries/**`
3. `site/src/lib/validation.ts`
4. `site/src/db/**`
5. `site/src/types/skill.ts`
6. `.planning/codebase/**`

### 合同层真源

7. `specs-v1/terms-and-directory-contract.md`
8. `specs-v1/routing-render-search-contract.md`

### 产品层参考

9. `specs-v1/PRD.md`

### 只能当历史状态或开发提示

10. `specs-v1/walkthroughV2.md`
11. `site/README.md`

## 当前仍可信的 contract

以下 contract 内容与真实代码当前保持一致，可以继续当约束层使用：

- `terms-and-directory-contract.md`
  - `site/` 是唯一应用根
  - 类型内部值固定为 `skill` / `mcp_server`
  - 十个分类 slug 与展示标签固定
- `routing-render-search-contract.md`
  - 首页承载完整搜索结果
  - 分类上下文由路径锁定
  - 搜索统一提交到 `/?q=`
  - 详情页对不存在或未发布条目返回 404
  - 页面直接调用查询层，不经过内部 API

## 已确认的漂移

### `specs-v1/walkthroughV2.md`

以下内容已经明显过期：

- “还没有查询层”
- “还没有首页、详情页、分类页、关于页”
- “当前 `site` 仍主要是脚手架默认页面”

这些表述与当前真实代码不符，因为相关页面、查询层和搜索流转已经落地。

### `site/README.md`

以下口径已经落后于当前实现：

- 把查询层和 `/?q=` 搜索基线描述为“implemented later”
- 把 `T3-01` 仍当成后续步骤，而当前查询层和页面已存在

README 仍可作为：

- 本地命令速查
- 数据库路径提示
- V1 不做 FTS5 的开发提示

但不能再作为“当前完成度”的真源。

## 只能作为历史参考的部分

### `walkthroughV2.md`

仍有参考价值的部分：

- 首版范围收缩思路
- backlog 划分
- 为什么暂不做 FTS5 / 公开 API / 部署硬化

但其“当前状态快照”部分不能继续当实现真源。

### `site/README.md`

仍有参考价值的部分：

- 常用命令
- 本地数据库默认路径
- seed 的幂等意图

但其任务阶段描述已经不是现状。

## 记录漂移的规则

- 发现代码与旧文档漂移时，优先更新 `docs/**`
- 不要默认回写 `specs-v1/**`
- `.planning/**` 只记录后续工作约束和路线，不承担漂移说明主文档职责
- 如果后续需要清理旧说明，也应先确认它是历史文档、开发提示，还是仍然承担 contract 角色

## 给后续 agent 的直接指令

- 先看代码，再看 `docs/**`
- 遇到 README 或 walkthrough 与代码冲突时，优先相信代码和本目录
- 不要把仓库根误判成应用根
- 不要把 `.planning` 当成 PRD 存放区
