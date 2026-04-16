# PowerUp Docs

本目录只记录当前代码已经实现的行为、开发方式、验证结论和文档漂移，不复述完整 PRD。

## 建议阅读顺序

1. [CURRENT-STATE.md](./CURRENT-STATE.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [ROUTING-RENDER-SEARCH.md](./ROUTING-RENDER-SEARCH.md)
4. [DATA-AND-CONTENT.md](./DATA-AND-CONTENT.md)
5. [DEVELOPMENT.md](./DEVELOPMENT.md)
6. [DRIFT-AND-SOURCES-OF-TRUTH.md](./DRIFT-AND-SOURCES-OF-TRUTH.md)
7. [FRONTEND-V2-SEPARATION.md](./FRONTEND-V2-SEPARATION.md)
8. [FRONTEND-V2-MIGRATION-PROMPT.md](./FRONTEND-V2-MIGRATION-PROMPT.md)

如果还需要产品目标或 contract，再去看：

- `../specs-v1/README.md`
- `../specs-v1/PRD.md`
- `../specs-v1/terms-and-directory-contract.md`
- `../specs-v1/routing-render-search-contract.md`

## 当前真源优先级

1. `site/src/app/**`
2. `site/src/components/**`
3. `site/src/lib/**`
4. `site/src/db/**`
5. `site/src/types/**`
6. `shared/**`
7. `docs/**`

以下内容只作辅助参考，不当作当前实现真源：

- `site/README.md`：运行手册
- `frontendv2/README.md`：独立前端工作区说明
- `specs-v1/**`：产品目标与 contract
- `specs-v1/_history/**`：历史记录
- `.planning/**`：GSD 执行层

## 本次核对结论

2026-04-11 这轮文档更新以 `site/` 当前代码、脚本和页面入口为准，已重新执行：

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:smoke`

如果后续代码再次变化，应优先更新本目录，而不是先改 PRD 或历史文档。
