# Drift And Sources Of Truth

本文用于明确当前该信什么，以及哪些文档只能按“目标”或“历史”来读。

## 当前真源优先级

1. `site/src/app/**`
2. `site/src/components/**`
3. `site/src/lib/**`
4. `site/src/db/**`
5. `site/src/types/**`
6. `shared/**`
7. `docs/**`

以下内容不是当前实现真源：

8. `site/README.md` 与 `frontendv2/README.md`
9. `specs-v1/**`
10. `specs-v1/_history/**`
11. `.planning/**`

## 本次已修正的漂移

2026-04-11 这轮文档更新已经把以下漂移收口到当前代码状态：

- 根 `README.md`
  - 明确仓库根不是应用根
  - 补上当前真实页面入口、只读 API 和运行方式
- `site/README.md`
  - 补上 `dev:clean`
  - 补上开发预检与默认数据库自动初始化行为
  - 明确当前通过的验证命令
- `docs/**`
  - 改为以当前 `site/` 实现为准
  - 补上当前真实的渲染方式、只读 API、图标渲染和验证结论
- `site/src/content/about.md`
  - 去掉“当前没有公开 API”这类已过时表述
  - 保留“没有写接口、后台和投稿流”这类仍然成立的边界

## 仍然需要小心的文档类型

### `specs-v1/**`

- 这些文件描述的是产品目标、术语和 contract
- 可以作为约束层参考
- 不能直接当作“当前页面已经实现了什么”的证明

### `specs-v1/_history/**`

- 属于历史记录
- 可能保留了“还没有页面”“还没有查询层”“还没有 API”之类的旧状态描述
- 这些内容只适合回看决策背景，不适合作为当前实现判断依据

### `.planning/**`

- 只承担 GSD 执行层职责
- 不是当前实现说明层
- 扫描产物若与代码冲突，优先相信代码与 `docs/**`

## 后续更新规则

- 先看代码，再改文档
- 当前实现变化，优先更新 `docs/**` 与必要的 README
- 不要默认回写 `specs-v1/**`
- 如果只是运行方式变化，优先更新 `site/README.md`
- 如果只是用户可见目录说明变化，再同步 `site/src/content/about.md`
