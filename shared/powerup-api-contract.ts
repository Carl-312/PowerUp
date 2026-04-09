import type {
  PowerUpCategorySlug,
  PowerUpSkillType,
} from "./powerup-taxonomy";

export const POWERUP_API_VERSION = "v1" as const;

export type PowerUpSkillSort = "updated_desc" | "name_asc";

export interface PowerUpListFilters {
  q?: string;
  type?: PowerUpSkillType;
  category?: PowerUpCategorySlug;
  sort: PowerUpSkillSort;
  page: number;
}

export interface PowerUpSkillListItem {
  name: string;
  slug: string;
  type: PowerUpSkillType;
  icon: string | null;
  summary: string;
  category: PowerUpCategorySlug;
  tags: string[];
  author: string;
  license: string | null;
  github_url: string | null;
  doc_url: string | null;
  supported_platforms: string[];
  updated_at: number;
}

export interface PowerUpSkillRecord extends PowerUpSkillListItem {
  description: string;
  install_guide: string | null;
  config_example: string | null;
}

export interface PowerUpCategoryCount {
  slug: PowerUpCategorySlug;
  label: string;
  total: number;
}

export interface PowerUpPagination {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PowerUpSkillDirectoryPayload {
  items: PowerUpSkillListItem[];
  filters: PowerUpListFilters;
  pagination: PowerUpPagination;
}

export interface PowerUpCategoryCollectionPayload {
  items: PowerUpCategoryCount[];
  totalPublished: number;
}

export interface PowerUpSkillDirectoryPagePayload {
  directory: PowerUpSkillDirectoryPayload;
  categories: PowerUpCategoryCollectionPayload;
}

export interface PowerUpSkillDetailPayload {
  item: PowerUpSkillRecord;
}

export interface PowerUpContentDocumentPayload {
  slug: string;
  title: string;
  markdown: string;
}

export interface PowerUpApiMeta {
  version: typeof POWERUP_API_VERSION;
  generatedAt: string;
}

export interface PowerUpApiSuccess<T> {
  data: T;
  meta: PowerUpApiMeta;
}

export interface PowerUpApiError {
  error: {
    code: string;
    message: string;
  };
  meta: PowerUpApiMeta;
}
