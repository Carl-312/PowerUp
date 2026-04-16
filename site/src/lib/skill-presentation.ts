import type { CategorySlug } from "@/lib/categories";
import type { SkillType } from "@/types/skill";

type SkillDateFormat = "compact" | "long";

const dateFormatters: Record<SkillDateFormat, Intl.DateTimeFormat> = {
  compact: new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  long: new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
};

export const CATEGORY_MASCOTS: Record<CategorySlug | "other", string> = {
  "developer-tools": "🛠️",
  "data-analytics": "📈",
  "communication-collaboration": "💬",
  "content-writing": "✍️",
  "search-information": "🔍",
  "business-finance": "💰",
  "design-media": "🎨",
  "security-ops": "🛡️",
  "files-storage": "📦",
  other: "🧩",
};

export const formatUpdatedAt = (
  value: number,
  format: SkillDateFormat = "compact",
) => dateFormatters[format].format(new Date(value * 1000));

export const getSkillFallbackIcon = ({
  type,
  category,
}: {
  type: SkillType;
  category: CategorySlug;
}) => (type === "mcp_server" ? "🌟" : CATEGORY_MASCOTS[category] ?? CATEGORY_MASCOTS.other);
