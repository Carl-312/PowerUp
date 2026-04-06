import { z } from "zod";

import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { SKILL_TYPES, type SkillType } from "@/types/skill";

export const SKILL_SORTS = ["updated_desc", "name_asc"] as const;

export type SkillSort = (typeof SKILL_SORTS)[number];

export const DEFAULT_SKILL_SORT: SkillSort = "updated_desc";
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 24;

type SearchParamValue = string | string[] | undefined;

export type SearchParamsInput =
  | URLSearchParams
  | Record<string, SearchParamValue>
  | undefined;

export interface SkillListQueryInput {
  q?: string;
  type?: SkillType;
  category?: CategorySlug;
  sort: SkillSort;
  page: number;
}

const skillListQuerySchema = z.object({
  q: z.string().optional(),
  type: z.enum(SKILL_TYPES).optional(),
  category: z.enum(CATEGORY_SLUGS).optional(),
  sort: z.enum(SKILL_SORTS).default(DEFAULT_SKILL_SORT),
  page: z.number().int().min(DEFAULT_PAGE).default(DEFAULT_PAGE),
});

const getFirstSearchParamValue = (value: SearchParamValue) =>
  Array.isArray(value) ? value[0] : value;

const normalizeQuery = (value: string | undefined) => {
  const normalized = value?.trim().replace(/\s+/g, " ");

  return normalized ? normalized : undefined;
};

const normalizePage = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isInteger(parsed) && parsed >= DEFAULT_PAGE ? parsed : undefined;
};

const toSearchParamRecord = (searchParams: SearchParamsInput) => {
  if (!searchParams) {
    return {};
  }

  if (searchParams instanceof URLSearchParams) {
    return {
      q: searchParams.get("q") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
    };
  }

  return {
    q: getFirstSearchParamValue(searchParams.q),
    type: getFirstSearchParamValue(searchParams.type),
    category: getFirstSearchParamValue(searchParams.category),
    sort: getFirstSearchParamValue(searchParams.sort),
    page: getFirstSearchParamValue(searchParams.page),
  };
};

interface ParseSkillListQueryOptions {
  fixedCategory?: CategorySlug;
  allowQuery?: boolean;
}

const parseSkillListQuery = (
  searchParams: SearchParamsInput,
  options: ParseSkillListQueryOptions = {},
): SkillListQueryInput => {
  const { fixedCategory, allowQuery = true } = options;
  const rawParams = toSearchParamRecord(searchParams);

  return skillListQuerySchema.parse({
    q: allowQuery ? normalizeQuery(rawParams.q) : undefined,
    type: SKILL_TYPES.includes(rawParams.type as SkillType)
      ? (rawParams.type as SkillType)
      : undefined,
    category: fixedCategory
      ? fixedCategory
      : CATEGORY_SLUGS.includes(rawParams.category as CategorySlug)
        ? (rawParams.category as CategorySlug)
        : undefined,
    sort: SKILL_SORTS.includes(rawParams.sort as SkillSort)
      ? (rawParams.sort as SkillSort)
      : undefined,
    page: normalizePage(rawParams.page),
  });
};

export const parseHomeListQuery = (searchParams: SearchParamsInput) =>
  parseSkillListQuery(searchParams);

export const parseCategoryListQuery = (
  searchParams: SearchParamsInput,
  category: CategorySlug,
) =>
  parseSkillListQuery(searchParams, {
    fixedCategory: category,
    allowQuery: false,
  });
