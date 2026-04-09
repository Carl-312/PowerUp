# Drift And Sources Of Truth

本文用于明确“当前应该信什么”，并把已经识别出的文档漂移固定下来，避免后续 agent 再把过期快照当成当前实现真源。

## 真源优先级

### 当前实现真源

1. `site/src/app/**`
2. `site/src/lib/**`
3. `site/src/db/**`
4. `site/src/types/**`
5. `docs/**`

### 合同层真源

6. `specs-v1/terms-and-directory-contract.md`
7. `specs-v1/routing-render-search-contract.md`

### 产品层参考

8. `specs-v1/PRD.md`

### 运行 / 历史 / 执行辅助

9. `site/README.md`
10. `specs-v1/_history/walkthrough*.md`
11. `.planning/**`

其中要特别注意：

- `.planning/**` 只承担 GSD 执行层职责，不是当前实现说明层
- `.planning/codebase/**` 是扫描产物，可辅助回看，但不能盖过真实代码与 `docs/**`
- `site/README.md` 是运行手册，不是当前实现快照
- walkthrough 文档是历史记录，不回升为默认入口

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

### `specs-v1/_history/walkthroughV2.md`

以下内容已经明显过期，并已在阶段一软归档中通过文档头部标记显式降级为历史信息：

- “还没有查询层”
- “还没有首页、详情页、分类页、关于页”
- “当前 `site` 仍主要是脚手架默认页面”

这些表述与当前真实代码不符，因此本文只能继续保留为历史规划记录，不能回升为当前实现真源。

### `site/README.md`

阶段一软归档后，`site/README.md` 已收口为“运行手册 + 命令速查”。
当前需要继续坚持的边界不是再回写它的项目进度，而是保持它只负责：

- 本地命令
- 数据库路径
- 验证入口
- 子目录阅读提示

它不再承担当前完成度说明职责。

### `specs-v1/PRD.md`

`PRD.md` 继续承担产品目标与验收标准角色，但其中少量“目标态”表述不能直接当成当前 UI 已落地事实：

- PRD 仍把列表卡片与详情基础信息区写成包含图标展示；当前代码保留了 `icon` 字段，但首页卡片和详情页头部都没有单独渲染图标 UI
- PRD 仍提到 `mcp_server` 在有数据时展示 API 端点相关信息；当前 schema 与查询层没有独立 endpoint 字段，详情页现阶段只围绕 `install_guide`、`config_example`、`doc_url`、`github_url` 展示接入信息

因此：

- `PRD.md` 仍可作为产品层参考
- 但判断“当前仓库已经实现了什么”时，优先相信真实代码与 `docs/**`
- 不要因为 PRD 中的目标态文案，反推当前页面已经存在图标 UI 或 endpoint 字段

### `.planning/codebase/**`

早期文档曾把 `.planning/codebase/**` 混入“真源优先级”，这会让执行层扫描产物和当前实现说明层混角色。
当前统一口径如下：

- `.planning/codebase/**` 可作为 GSD 辅助扫描结果保留
- 但它不是当前实现真源
- 若其内容与代码或 `docs/**` 冲突，优先相信代码与 `docs/**`

## 只能作为历史参考的部分

### `_history/walkthroughV2.md`

仍有参考价值的部分：

- 首版范围收缩思路
- backlog 划分
- 为什么暂不做 FTS5 / 公开 API / 部署硬化

但其“当前状态快照”部分不能继续当实现真源；阶段一软归档后，应把它理解为历史规划记录。

### `site/README.md`

仍有参考价值的部分：

- 常用命令
- 本地数据库默认路径
- seed 的幂等意图
- 本地验证入口提示

但它已经被收口为子目录运行手册，不应再承载任务阶段说明。

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
