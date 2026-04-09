export const POWERUP_CATEGORY_SLUGS = [
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

export type PowerUpCategorySlug = (typeof POWERUP_CATEGORY_SLUGS)[number];

export const POWERUP_CATEGORY_LABELS: Record<PowerUpCategorySlug, string> = {
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

export const POWERUP_SKILL_TYPES = ["skill", "mcp_server"] as const;

export type PowerUpSkillType = (typeof POWERUP_SKILL_TYPES)[number];

export const POWERUP_SKILL_TYPE_LABELS: Record<PowerUpSkillType, string> = {
  skill: "Skill",
  mcp_server: "MCP",
};
