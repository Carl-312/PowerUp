import type { PowerUpListFilters } from "./contracts";

const DEFAULT_PAGE = 1;
const DEFAULT_SORT = "updated_desc";

export const buildDirectoryHref = (
  pathname: string,
  filters: PowerUpListFilters,
  options: {
    allowCategoryFilter: boolean;
    overrides?: Partial<PowerUpListFilters>;
  },
) => {
  const nextFilters = {
    ...filters,
    ...options.overrides,
  };
  const params = new URLSearchParams();

  if (nextFilters.q) {
    params.set("q", nextFilters.q);
  }

  if (nextFilters.type) {
    params.set("type", nextFilters.type);
  }

  if (options.allowCategoryFilter && nextFilters.category) {
    params.set("category", nextFilters.category);
  }

  if (nextFilters.sort !== DEFAULT_SORT) {
    params.set("sort", nextFilters.sort);
  }

  if (nextFilters.page > DEFAULT_PAGE) {
    params.set("page", String(nextFilters.page));
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};
