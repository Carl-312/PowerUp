# Brownfield Requirements

后续任何 GSD 工作都必须满足以下实现约束、contract 约束和文档治理约束。

## 1. Brownfield 约束

- 直接基于当前真实代码工作，不按“新项目初始化”处理
- 任何判断先看 `site/`，不要先看仓库根或历史 walkthrough
- 默认不重建项目定义，不补建历史 phase，不伪造已完成阶段

## 2. 应用根约束

- `site/` 是唯一应用根
- Next.js、Drizzle、数据库和本地验证命令都从 `site/` 执行
- 禁止把根目录当成运行时代码根目录

## 3. Contract 约束

### 术语与枚举

- 类型内部值固定为 `skill` / `mcp_server`
- 分类 slug 固定为 `site/src/lib/categories.ts` 中的十个值
- 不在页面、seed 或其他模块复制第二套类型/分类常量

### 路由与搜索

- 首页继续作为完整搜索结果承载页
- 搜索统一走 `/?q=`
- 分类页分类上下文继续由路径锁定
- 页面继续优先直接调用查询层，不新增内部 API 中转作为默认方案

### 可见性

- 只有 `published` 记录进入前台列表、详情、搜索与分类计数
- `source_url`、`source_kind`、`last_verified_at`、`review_status`、`created_at` 继续视为内部治理字段

## 4. 文档治理约束

- `specs-v1/` 继续承担产品规格和 contract 层
- `docs/` 继续承担当前实现说明、真源说明和漂移说明
- `.planning/` 只承担 GSD 运营层
- 不要把 `docs/` 写成 PRD 镜像
- 不要把 `.planning` 文档写成产品介绍页

## 5. 漂移处理约束

- 发现 README、walkthrough 或其他历史文档与代码不一致时，先更新 `docs/DRIFT-AND-SOURCES-OF-TRUTH.md`
- 未获明确授权前，不回写 `specs-v1/**`

## 6. 变更边界

- 默认不修改 `site/**`、`specs-v1/**`、schema、seed、package 配置
- 如后续任务需要动代码，必须建立在当前 contract 不被误写坏的前提下
- 测试、CI、部署增强只能 forward-only 追加，不能伪造“历史已完成”

## 7. Phase 5 Feature Requirements

- **SHARE-01**：已发布的 `skill` 与 `mcp_server` 详情页都要提供统一的分享入口，且入口落在当前 `site/` 详情体验内部，不新增后台、账号或写接口。
- **SHARE-02**：分享文案至少包含名称、类型、分类、简短介绍，以及按明确优先级解析出的单个最佳来源链接。
- **SHARE-03**：分享图片必须基于当前条目动态生成，不能依赖静态写死图片。
- **SHARE-04**：方案必须明确区分服务端图片生成与客户端复制/下载触发，并覆盖移动端行为、加载态、失败态和缺失字段降级。
- **SHARE-05**：方案必须补充验证与文档，覆盖分享图产物、复制文案结果、来源链接回退规则和新只读路由/页面行为。

## 8. Phase Traceability

| Requirement | Phase | Status | Notes |
| --- | --- | --- | --- |
| SHARE-01 | Phase 5 | Planned | 详情页入口与适用范围 |
| SHARE-02 | Phase 5 | Planned | 分享文案字段与来源链接规则 |
| SHARE-03 | Phase 5 | Planned | 服务端动态分享图 |
| SHARE-04 | Phase 5 | Planned | 客户端下载/复制、移动端与失败态 |
| SHARE-05 | Phase 5 | Planned | 测试、smoke、文档更新 |
