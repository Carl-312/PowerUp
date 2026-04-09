import type {
  PowerUpContentDocumentPayload,
  PowerUpListFilters,
  PowerUpSkillDetailPayload,
  PowerUpSkillDirectoryPagePayload,
  PowerUpSkillListItem,
  PowerUpSkillRecord,
  PowerUpSkillSort,
} from "./contracts";
import { POWERUP_CATEGORY_LABELS, POWERUP_CATEGORY_SLUGS } from "./contracts";

const fallbackSkills: PowerUpSkillRecord[] = [
  {
    name: "Warp Prompt Kit",
    slug: "warp-prompt-kit",
    type: "skill",
    icon: "🍄",
    summary: "用更有节奏感的提示词模板，把复杂工作流组织成清晰的闯关步骤。",
    category: "developer-tools",
    tags: ["prompting", "workflow", "templates"],
    author: "PowerUp",
    license: "MIT",
    github_url: "https://github.com/openai",
    doc_url: "https://platform.openai.com/docs",
    supported_platforms: ["ChatGPT", "Codex", "CLI"],
    updated_at: Math.floor(Date.UTC(2026, 3, 8) / 1000),
    description:
      "这是一个为日常开发和代理协作准备的提示词工具包，适合把复杂问题拆成明确的小阶段。\n\n- 适合做需求澄清、调试、重构\n- 可以配合目录式工作流组织任务\n- 在没有后端 API 时，本地 fallback 也能让 UI 正常演示",
    install_guide:
      "1. 复制模板到你的工作区\n2. 根据任务类型选一个入口提示\n3. 用迭代方式补充上下文",
    config_example:
      "```md\n# Goal\nRefactor the page without breaking API contracts.\n\n# Constraints\n- Only touch frontendv2\n- Verify with build and browser checks\n```",
  },
  {
    name: "Wonder MCP Bridge",
    slug: "wonder-mcp-bridge",
    type: "mcp_server",
    icon: "⭐",
    summary: "把外部工具和浏览器调试链路接成一条更顺手的冒险通道。",
    category: "communication-collaboration",
    tags: ["mcp", "integration", "bridge"],
    author: "PowerUp",
    license: "Apache-2.0",
    github_url: "https://github.com/modelcontextprotocol",
    doc_url: "https://modelcontextprotocol.io/",
    supported_platforms: ["Desktop", "CLI"],
    updated_at: Math.floor(Date.UTC(2026, 3, 7) / 1000),
    description:
      "把 MCP 服务接进来之后，目录页可以快速跳到文档、调试工具和协作场景，比较适合做浏览器验证和联调展示。",
    install_guide:
      "```bash\nnpm install\nnpm run dev\n```\n\n然后把服务地址挂到你的客户端配置里。",
    config_example:
      "```json\n{\n  \"mcpServers\": {\n    \"wonder\": {\n      \"command\": \"npm\",\n      \"args\": [\"run\", \"dev\"]\n    }\n  }\n}\n```",
  },
  {
    name: "Coin Metrics Board",
    slug: "coin-metrics-board",
    type: "skill",
    icon: "🪙",
    summary: "把数据看板做成更好扫描的金币面板，适合演示指标类目录卡片。",
    category: "data-analytics",
    tags: ["metrics", "dashboard", "analytics"],
    author: "PowerUp",
    license: "MIT",
    github_url: null,
    doc_url: "https://observablehq.com/",
    supported_platforms: ["Web"],
    updated_at: Math.floor(Date.UTC(2026, 3, 5) / 1000),
    description:
      "适合放在数据与分析分类里，用来展示目录卡片在高信息密度场景下的视觉承载方式。",
    install_guide: null,
    config_example: null,
  },
  {
    name: "Bloom Search Lens",
    slug: "bloom-search-lens",
    type: "skill",
    icon: "🌼",
    summary: "给搜索与信息类条目配一套更轻快的发现界面和筛选体验。",
    category: "search-information",
    tags: ["search", "discovery", "ranking"],
    author: "PowerUp",
    license: null,
    github_url: null,
    doc_url: "https://developer.mozilla.org/",
    supported_platforms: ["Web", "Mobile"],
    updated_at: Math.floor(Date.UTC(2026, 3, 4) / 1000),
    description:
      "强调搜索结果的扫描速度、分类切换和摘要表达，适合在 Wonder 风格下承载知识发现类内容。",
    install_guide: null,
    config_example: null,
  },
  {
    name: "Pipe Storage Vault",
    slug: "pipe-storage-vault",
    type: "skill",
    icon: "📦",
    summary: "面向文件与存储的目录入口，用更强的结构感表达存储能力。",
    category: "files-storage",
    tags: ["storage", "files", "sync"],
    author: "PowerUp",
    license: "MIT",
    github_url: "https://github.com/git-lfs/git-lfs",
    doc_url: null,
    supported_platforms: ["Desktop", "Cloud"],
    updated_at: Math.floor(Date.UTC(2026, 3, 2) / 1000),
    description:
      "如果后端还没起，本地 fallback 会继续提供示例数据，确保文件与存储分类页可浏览。",
    install_guide: null,
    config_example: null,
  },
  {
    name: "Rainbow Media Forge",
    slug: "rainbow-media-forge",
    type: "skill",
    icon: "🌈",
    summary: "给设计与媒体类条目一个更有展示性的详情页和卡片语言。",
    category: "design-media",
    tags: ["design", "media", "creative"],
    author: "PowerUp",
    license: "CC-BY-4.0",
    github_url: null,
    doc_url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    supported_platforms: ["Web", "Figma"],
    updated_at: Math.floor(Date.UTC(2026, 3, 1) / 1000),
    description:
      "用于演示视觉型条目在目录与详情页中的表现方式，包括标签、平台和外链卡片。",
    install_guide: null,
    config_example: null,
  },
];

const sortSkills = (items: PowerUpSkillRecord[], sort: PowerUpSkillSort) => {
  const clone = [...items];

  if (sort === "name_asc") {
    clone.sort((left, right) => left.name.localeCompare(right.name));
    return clone;
  }

  clone.sort((left, right) => right.updated_at - left.updated_at);
  return clone;
};

const applyFilters = (items: PowerUpSkillRecord[], filters: PowerUpListFilters) => {
  const query = filters.q?.trim().toLowerCase();

  return items.filter((item) => {
    if (filters.type && item.type !== filters.type) {
      return false;
    }

    if (filters.category && item.category !== filters.category) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      item.name,
      item.summary,
      item.author,
      item.category,
      ...item.tags,
      ...item.supported_platforms,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
};

const toDirectoryPagePayload = (requestPath: string): PowerUpSkillDirectoryPagePayload => {
  const url = new URL(requestPath, "http://powerup.local");
  const page = Math.max(Number(url.searchParams.get("page") ?? "1") || 1, 1);
  const sort = (url.searchParams.get("sort") as PowerUpSkillSort | null) ?? "updated_desc";

  const filters: PowerUpListFilters = {
    q: url.searchParams.get("q") ?? undefined,
    type: (url.searchParams.get("type") as PowerUpListFilters["type"] | null) ?? undefined,
    category:
      (url.searchParams.get("category") as PowerUpListFilters["category"] | null) ?? undefined,
    sort,
    page,
  };

  const filtered = sortSkills(applyFilters(fallbackSkills, filters), sort);
  const pageSize = 6;
  const totalItems = filtered.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const currentPage = Math.min(page, totalPages);
  const items = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const directoryItems: PowerUpSkillListItem[] = items.map(
    ({ description: _description, install_guide: _installGuide, config_example: _config, ...rest }) =>
      rest,
  );

  const categoryTotals = fallbackSkills.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.category] = (accumulator[item.category] ?? 0) + 1;
    return accumulator;
  }, {});

  return {
    directory: {
      items: directoryItems,
      filters: {
        ...filters,
        page: currentPage,
      },
      pagination: {
        totalItems,
        totalPages,
        page: currentPage,
        pageSize,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    },
    categories: {
      totalPublished: fallbackSkills.length,
      items: POWERUP_CATEGORY_SLUGS.map((slug) => ({
        slug,
        label: POWERUP_CATEGORY_LABELS[slug],
        total: categoryTotals[slug] ?? 0,
      })),
    },
  };
};

const toSkillDetailPayload = (requestPath: string): PowerUpSkillDetailPayload | null => {
  const slug = requestPath.split("/skills/")[1]?.split("?")[0];
  const item = fallbackSkills.find((skill) => skill.slug === slug);

  return item ? { item } : null;
};

const aboutPayload: PowerUpContentDocumentPayload = {
  slug: "about",
  title: "About PowerUp Frontend V2",
  markdown: `
PowerUp Frontend V2 是一个专门给前后端解耦准备的前端工作区。

## 当前这个本地 fallback 的作用

- 当 \`/api/v1/**\` 还没有启动或暂时返回 \`503\` 时，页面不会整页空白
- 首页、分类页、详情页和 About 页依然可以直接预览视觉和交互
- 等后端恢复后，前端会继续优先使用真实 API 数据

## 这次修复做了什么

- 保留真实 API-first 读取逻辑
- 在开发环境下增加本地兜底内容
- 避免首屏动画把内容起始状态变成不可见
`,
};

export const getDevFallbackPayload = <T>(path: string): T | null => {
  if (path.startsWith("/skills?") || path === "/skills") {
    return toDirectoryPagePayload(path) as T;
  }

  if (path.startsWith("/skills/")) {
    return toSkillDetailPayload(path) as T | null;
  }

  if (path === "/content/about") {
    return aboutPayload as T;
  }

  return null;
};
