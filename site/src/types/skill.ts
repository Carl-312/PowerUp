import type { CategorySlug } from "@/lib/categories";
import {
  POWERUP_SKILL_TYPE_LABELS,
  POWERUP_SKILL_TYPES,
  type PowerUpSkillType,
} from "../../../shared/powerup-taxonomy";

export const SKILL_TYPES = POWERUP_SKILL_TYPES;
export const REVIEW_STATUSES = [
  "draft",
  "reviewed",
  "published",
  "archived",
] as const;
export const SOURCE_KINDS = [
  "official_docs",
  "github_repo",
  "vendor_site",
  "community_directory",
] as const;

export type SkillType = PowerUpSkillType;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
export type SourceKind = (typeof SOURCE_KINDS)[number];

export const SKILL_TYPE_LABELS: Record<SkillType, string> = POWERUP_SKILL_TYPE_LABELS;

export const PUBLIC_SKILL_FIELDS = [
  "name",
  "slug",
  "type",
  "icon",
  "summary",
  "description",
  "category",
  "tags",
  "author",
  "license",
  "github_url",
  "doc_url",
  "install_guide",
  "config_example",
  "supported_platforms",
  "updated_at",
] as const;

export const INTERNAL_SKILL_FIELDS = [
  "source_url",
  "source_kind",
  "last_verified_at",
  "review_status",
  "created_at",
] as const;

export interface SkillRecord {
  id: number;
  name: string;
  slug: string;
  type: SkillType;
  icon: string | null;
  summary: string;
  description: string;
  category: CategorySlug;
  tags: string[];
  author: string;
  license: string | null;
  github_url: string | null;
  doc_url: string | null;
  install_guide: string | null;
  config_example: string | null;
  supported_platforms: string[];
  source_url: string;
  source_kind: SourceKind;
  last_verified_at: number;
  review_status: ReviewStatus;
  created_at: number;
  updated_at: number;
}

export type PublicSkillRecord = Pick<SkillRecord, (typeof PUBLIC_SKILL_FIELDS)[number]>;
export type InternalSkillRecord = Pick<
  SkillRecord,
  (typeof INTERNAL_SKILL_FIELDS)[number]
>;

export type SkillListItem = Pick<
  SkillRecord,
  | "name"
  | "slug"
  | "type"
  | "icon"
  | "summary"
  | "category"
  | "tags"
  | "author"
  | "license"
  | "github_url"
  | "doc_url"
  | "supported_platforms"
  | "updated_at"
>;

export type SearchResultItem = Pick<
  SkillRecord,
  "name" | "slug" | "type" | "summary" | "category" | "tags" | "updated_at"
>;

export interface SkillSeedRecord
  extends Omit<
    SkillRecord,
    | "id"
    | "created_at"
    | "review_status"
    | "icon"
    | "license"
    | "github_url"
    | "doc_url"
    | "install_guide"
    | "config_example"
  > {
  icon?: string | null;
  license?: string | null;
  github_url?: string | null;
  doc_url?: string | null;
  install_guide?: string | null;
  config_example?: string | null;
  review_status?: ReviewStatus;
  created_at?: number;
}
