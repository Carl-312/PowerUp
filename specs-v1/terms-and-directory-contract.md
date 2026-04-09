# PowerUp V1 术语与目录约定

本文是保留的 contract 文档，用于冻结术语、目录职责、类型枚举和分类 slug。
当前代码实现仍应与本文保持一致，避免在 `PRD.md`、walkthrough 历史文档和源码中出现多套口径。

---

## 1. 作用范围

- 适用目录：`/home/carl/PowerUp/specs-v1` 与当前应用根 `/home/carl/PowerUp/site`。
- `PRD.md` 与 `./_history/` 下的 walkthrough 文档可作为产品层或历史层参考，但涉及术语、枚举、目录职责时以本文为准。
- 本文冻结的是“命名和枚举”，不是视觉文案自由发挥区；涉及条目类型、分类、目录职责时，以本文为准。

---

## 2. 项目与目录职责

- 项目正式名称固定为 `PowerUp`，不得回退到旧项目名或临时占位名。
- `/home/carl/PowerUp/specs-v1` 只放 V1 产品规格、contract 与历史归档文档，不放运行时代码、数据库文件或开发脚本。
- `/home/carl/PowerUp/site` 是唯一应用根；当前 `src/`、`public/`、`data/`、`drizzle/`、`package.json` 都在这里。
- `/home/carl/PowerUp` 根目录本身不直接承载 Next.js 应用代码，避免文档和实现混放。

---

## 3. 前台术语与内部枚举

| 使用场景 | 前台展示 | 内部值 | 约束 |
| --- | --- | --- | --- |
| 类型标签、筛选器、列表文案 | `Skill` | `skill` | 对用户展示统一写 `Skill` |
| 类型标签、筛选器、列表文案 | `MCP` | `mcp_server` | 对用户展示统一写 `MCP`；解释性文案可以补充写成 “MCP Server” |

- URL 参数、数据库字段、API 返回值、TypeScript 类型统一使用内部值：`skill`、`mcp_server`。
- 前台文案 `Skill`、`MCP` 不能直接拿去做 URL slug、数据库枚举或接口参数。
- 类型定义的目标文件固定为 `site/src/types/skill.ts`。

```ts
export const SKILL_TYPES = ["skill", "mcp_server"] as const;

export type SkillType = (typeof SKILL_TYPES)[number];

export const SKILL_TYPE_LABELS: Record<SkillType, string> = {
  skill: "Skill",
  mcp_server: "MCP",
};
```

---

## 4. 分类 slug 常量与展示标签

| slug | 展示标签 |
| --- | --- |
| `developer-tools` | `🔧 开发工具` |
| `data-analytics` | `📊 数据与分析` |
| `communication-collaboration` | `💬 通讯与协作` |
| `content-writing` | `📝 内容与写作` |
| `search-information` | `🔍 搜索与信息` |
| `business-finance` | `💰 商业与金融` |
| `design-media` | `🎨 设计与媒体` |
| `security-ops` | `🔐 安全与运维` |
| `files-storage` | `📁 文件与存储` |
| `other` | `🧩 其他` |

- 分类 slug 只能从上表十个值中选择，不允许在代码、文档或数据中派生别名。
- URL、查询参数、数据库字段统一使用 slug；emoji 和中文标签只用于前台展示。
- 分类常量的目标文件固定为 `site/src/lib/categories.ts`。

```ts
export const CATEGORY_SLUGS = [
  "developer-tools",
  "data-analytics",
  "communication-collaboration",
  "content-writing",
  "search-information",
  "business-finance",
  "design-media",
  "security-ops",
  "files-storage",
  "other",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  "developer-tools": "🔧 开发工具",
  "data-analytics": "📊 数据与分析",
  "communication-collaboration": "💬 通讯与协作",
  "content-writing": "📝 内容与写作",
  "search-information": "🔍 搜索与信息",
  "business-finance": "💰 商业与金融",
  "design-media": "🎨 设计与媒体",
  "security-ops": "🔐 安全与运维",
  "files-storage": "📁 文件与存储",
  other: "🧩 其他",
};
```

---

## 5. 执行约束

- 后续实现只能从 `site/src/lib/categories.ts` 和 `site/src/types/skill.ts` 暴露分类与类型常量，禁止在页面、接口、seed 数据里重复维护第二套数组或映射。
- 如果 `PRD.md`、walkthrough 历史文档与本文发生冲突，以本文为先，并同步回写冲突文案。
- 搜索、筛选、分页、详情查询等所有输入输出都必须沿用本文中的 slug 和类型内部值。
- 验收时全文搜索 `PowerUp`、`mcp_server`、十个分类 slug，确认不存在第二套命名或旧项目名。
