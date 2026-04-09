import type {
  PowerUpCategoryCollectionPayload,
  PowerUpContentDocumentPayload,
  PowerUpSkillDetailPayload,
  PowerUpSkillDirectoryPayload,
} from "../../../../shared/powerup-api-contract";
import type { CategoryCount, SkillListResult } from "@/lib/queries/skills";
import type { PublicSkillRecord } from "@/types/skill";

export const toSkillDirectoryPayload = (
  result: SkillListResult,
): PowerUpSkillDirectoryPayload => ({
  items: result.items,
  filters: result.filters,
  pagination: {
    totalItems: result.totalItems,
    totalPages: result.totalPages,
    page: result.page,
    pageSize: result.pageSize,
    hasPreviousPage: result.hasPreviousPage,
    hasNextPage: result.hasNextPage,
  },
});

export const toCategoryCollectionPayload = (
  categories: CategoryCount[],
): PowerUpCategoryCollectionPayload => ({
  items: categories,
  totalPublished: categories.reduce((sum, item) => sum + item.total, 0),
});

export const toSkillDetailPayload = (
  item: PublicSkillRecord,
): PowerUpSkillDetailPayload => ({
  item,
});

export const toContentDocumentPayload = ({
  slug,
  title,
  markdown,
}: {
  slug: string;
  title: string;
  markdown: string;
}): PowerUpContentDocumentPayload => ({
  slug,
  title,
  markdown,
});
