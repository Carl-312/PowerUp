# 代码约定

**分析日期：** 2026-04-07

## 语言与类型

- 代码主体使用 TypeScript，页面和组件以 `.tsx` 为主
- `site/tsconfig.json` 开启了 `strict`
- 使用路径别名 `@/*` 指向 `site/src/*`
- 代码里广泛依赖静态类型，而不是弱约束对象传递

## 命名风格

- React 组件使用 PascalCase，例如：
  - `SiteSearchForm`
  - `SkillDirectory`
  - `SkillDetailHeader`
- 函数和局部变量使用 camelCase，例如：
  - `parseHomeListQuery`
  - `getCategoryCounts`
  - `buildWhereClause`
- 常量采用大写或大写数组命名，例如：
  - `CATEGORY_SLUGS`
  - `SKILL_TYPES`
  - `DEFAULT_PAGE_SIZE`

## 路由与输入处理

- URL 参数先归一化，再走 zod 校验，入口在 `site/src/lib/validation.ts`
- 首页和分类页都把筛选、排序、分页编码到 URL 中，而不是依赖本地状态
- 非法 slug / category 统一通过 `notFound()` 处理
- 页面级 SEO 元信息通过 `metadata` 或 `generateMetadata` 导出

## 数据与类型边界

- 类型、状态枚举、字段公开边界集中在 `site/src/types/skill.ts`
- 分类常量集中在 `site/src/lib/categories.ts`
- SQLite 中的数组型字段当前以 JSON 文本存储：
  - `tags`
  - `supported_platforms`
- 查询层通过 `parseJsonTextArray()` 做解码和容错

## 错误处理模式

- 输入异常：
  - 通过 zod schema 和安全归一化兜底
- 数据不存在：
  - 页面层直接 `notFound()`
- JSON 解析失败：
  - `parseJsonTextArray()` 的 `try/catch` 回退为空数组
- 种子脚本失败：
  - `site/src/db/seed.ts` 在 `catch` 中打印错误并设置 `process.exitCode = 1`

## UI 与样式约定

- 样式以 Tailwind 工具类内联为主
- `site/components.json` 表明项目使用 shadcn 体系，风格为 `radix-nova`
- 基础 design token 和 markdown 样式在 `site/src/app/globals.css`
- 通用 UI 组件集中在 `site/src/components/ui/**`
- 中文产品文案与英文技术命名并存，这是当前项目的稳定模式

## React / Next 模式

- 页面文件目前都是服务端组件风格，没有在已检查页面中看到 `use client`
- 页面直接调用服务端查询函数，而不是请求站内 API
- 详情页使用 `cache()` 包装 `getSkillBySlug()`，减少同请求内重复查询

## 注释与可读性

- 代码整体偏“自解释”，注释数量不多
- 真正的业务约束更多沉淀在：
  - `specs-v1/terms-and-directory-contract.md`
  - `specs-v1/routing-render-search-contract.md`
  - `specs-v1/PRD.md`

## 结论

- 当前代码风格一致性较好，尤其是在常量集中、URL 驱动状态、查询逻辑下沉这几方面。
- 风险不在风格失控，而在缺少自动化测试与文档同步机制。
