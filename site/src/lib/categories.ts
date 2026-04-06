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
