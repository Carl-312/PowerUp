import {
  and,
  asc,
  count,
  desc,
  eq,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { type AnySQLiteColumn } from "drizzle-orm/sqlite-core";

import { CATEGORY_LABELS, CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type SkillListQueryInput,
  type SkillSort,
} from "@/lib/validation";
import { db } from "@/db";
import { skills, type SkillRow } from "@/db/schema";
import type { PublicSkillRecord, SkillListItem, SkillType } from "@/types/skill";

export interface CategoryCount {
  slug: CategorySlug;
  label: string;
  total: number;
}

export interface SkillListResult {
  items: SkillListItem[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  filters: SkillListQueryInput;
}

const publishedOnlyCondition = eq(skills.review_status, "published");

const listSkillSelection = {
  name: skills.name,
  slug: skills.slug,
  type: skills.type,
  icon: skills.icon,
  summary: skills.summary,
  category: skills.category,
  tags: skills.tags,
  author: skills.author,
  license: skills.license,
  github_url: skills.github_url,
  doc_url: skills.doc_url,
  supported_platforms: skills.supported_platforms,
  updated_at: skills.updated_at,
};

type ListSkillRow = Pick<
  SkillRow,
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

const escapeLikePattern = (value: string) => value.replace(/[%_\\]/g, "\\$&");

const buildLikeCondition = (column: AnySQLiteColumn, value: string): SQL =>
  sql`${column} LIKE ${`%${escapeLikePattern(value)}%`} ESCAPE '\\'`;

const parseJsonTextArray = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value) as unknown;

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const mapRowToListItem = (row: ListSkillRow): SkillListItem => ({
  ...row,
  type: row.type as SkillType,
  category: row.category as CategorySlug,
  tags: parseJsonTextArray(row.tags),
  supported_platforms: parseJsonTextArray(row.supported_platforms),
});

const mapRowToPublicSkill = (row: SkillRow): PublicSkillRecord => ({
  name: row.name,
  slug: row.slug,
  type: row.type,
  icon: row.icon,
  summary: row.summary,
  description: row.description,
  category: row.category,
  tags: parseJsonTextArray(row.tags),
  author: row.author,
  license: row.license,
  github_url: row.github_url,
  doc_url: row.doc_url,
  install_guide: row.install_guide,
  config_example: row.config_example,
  supported_platforms: parseJsonTextArray(row.supported_platforms),
  updated_at: row.updated_at,
});

const buildWhereClause = (filters: SkillListQueryInput) => {
  const conditions: SQL[] = [publishedOnlyCondition];

  if (filters.type) {
    conditions.push(eq(skills.type, filters.type));
  }

  if (filters.category) {
    conditions.push(eq(skills.category, filters.category));
  }

  if (filters.q) {
    const searchTerms = filters.q.split(/\s+/).filter(Boolean);

    for (const term of searchTerms) {
      conditions.push(
        or(
          buildLikeCondition(skills.name, term),
          buildLikeCondition(skills.summary, term),
          buildLikeCondition(skills.description, term),
          buildLikeCondition(skills.tags, term),
        )!,
      );
    }
  }

  return and(...conditions)!;
};

const getOrderBy = (sort: SkillSort) => {
  switch (sort) {
    case "name_asc":
      return [asc(skills.name), desc(skills.updated_at)] as const;
    case "updated_desc":
    default:
      return [desc(skills.updated_at), asc(skills.name)] as const;
  }
};

const getSafePage = (requestedPage: number, totalPages: number) => {
  if (totalPages < DEFAULT_PAGE) {
    return DEFAULT_PAGE;
  }

  return Math.min(Math.max(requestedPage, DEFAULT_PAGE), totalPages);
};

export const listSkills = (filters: SkillListQueryInput): SkillListResult => {
  const whereClause = buildWhereClause(filters);
  const totalItems = db
    .select({ total: count() })
    .from(skills)
    .where(whereClause)
    .get()?.total ?? 0;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / DEFAULT_PAGE_SIZE);
  const page = getSafePage(filters.page, totalPages);
  const offset = (page - 1) * DEFAULT_PAGE_SIZE;
  const items = db
    .select(listSkillSelection)
    .from(skills)
    .where(whereClause)
    .orderBy(...getOrderBy(filters.sort))
    .limit(DEFAULT_PAGE_SIZE)
    .offset(offset)
    .all()
    .map(mapRowToListItem);

  return {
    items,
    totalItems,
    totalPages,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    hasPreviousPage: page > DEFAULT_PAGE,
    hasNextPage: totalPages > 0 && page < totalPages,
    filters: {
      ...filters,
      page,
    },
  };
};

export const getSkillBySlug = (slug: string): PublicSkillRecord | null => {
  const row = db
    .select()
    .from(skills)
    .where(and(eq(skills.slug, slug), publishedOnlyCondition))
    .get();

  return row ? mapRowToPublicSkill(row) : null;
};

export const getPublishedSlugs = () =>
  db
    .select({ slug: skills.slug })
    .from(skills)
    .where(publishedOnlyCondition)
    .orderBy(asc(skills.slug))
    .all()
    .map((row) => row.slug);

export const getCategoryCounts = (): CategoryCount[] => {
  const totals = db
    .select({
      category: skills.category,
      total: count(),
    })
    .from(skills)
    .where(publishedOnlyCondition)
    .groupBy(skills.category)
    .all();
  const totalsMap = new Map(totals.map((row) => [row.category as CategorySlug, row.total]));

  return CATEGORY_SLUGS.map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug],
    total: totalsMap.get(slug) ?? 0,
  }));
};
