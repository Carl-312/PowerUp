import type { ReactNode } from "react";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/categories";
import type { SkillListResult } from "@/lib/queries/skills";
import {
  DEFAULT_PAGE,
  DEFAULT_SKILL_SORT,
  type SkillListQueryInput,
  type SkillSort,
} from "@/lib/validation";
import { formatUpdatedAt, getSkillFallbackIcon } from "@/lib/skill-presentation";
import { cn } from "@/lib/utils";
import { SKILL_TYPE_LABELS, type SkillListItem, type SkillType } from "@/types/skill";

const sortLabels: Record<SkillSort, string> = {
  updated_desc: "最近更新优先",
  name_asc: "名称 A-Z",
};

interface SkillDirectoryProps {
  pathname: string;
  result: SkillListResult;
  allowCategoryFilter: boolean;
  variant?: "home" | "category";
}

const buildDirectoryHref = ({
  pathname,
  filters,
  overrides = {},
  includeCategory,
}: {
  pathname: string;
  filters: SkillListQueryInput;
  overrides?: Partial<SkillListQueryInput>;
  includeCategory: boolean;
}) => {
  const nextFilters = {
    ...filters,
    ...overrides,
  };
  const params = new URLSearchParams();

  if (nextFilters.q) {
    params.set("q", nextFilters.q);
  }

  if (nextFilters.type) {
    params.set("type", nextFilters.type);
  }

  if (includeCategory && nextFilters.category) {
    params.set("category", nextFilters.category);
  }

  if (nextFilters.sort !== DEFAULT_SKILL_SORT) {
    params.set("sort", nextFilters.sort);
  }

  if (nextFilters.page > DEFAULT_PAGE) {
    params.set("page", String(nextFilters.page));
  }

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
};

const getFilterSummaryItems = (
  filters: SkillListQueryInput,
  allowCategoryFilter: boolean,
) => {
  const chips: string[] = [];

  if (filters.q) {
    chips.push(`关键词 “${filters.q}”`);
  }

  if (filters.type) {
    chips.push(`类型 ${SKILL_TYPE_LABELS[filters.type]}`);
  }

  if (allowCategoryFilter) {
    if (filters.category) {
      chips.push(`分类 ${CATEGORY_LABELS[filters.category]}`);
    }
  } else if (filters.category) {
    chips.push(`固定分类 ${CATEGORY_LABELS[filters.category]}`);
  }

  if (filters.sort !== DEFAULT_SKILL_SORT) {
    chips.push(`排序 ${sortLabels[filters.sort]}`);
  }

  if (chips.length === 0) {
    chips.push("显示全部已收录内容");
  }

  return chips;
};

const getDirectoryCopy = (variant: SkillDirectoryProps["variant"]) => {
  if (variant === "category") {
    return {
      filterDescription:
        "分类已经确定，可以继续按类型、排序和分页缩小范围，把注意力放在真正相关的结果上。",
      resultsEyebrow: "分类结果",
      resultsTitle: "这个分类下的内容",
      resultsDescription:
        "这里聚合了同一方向下的收录条目，方便你快速浏览标题、摘要和关键信息。",
    };
  }

  return {
    filterDescription:
      "先用搜索和分类定一个大方向，再通过这里的筛选与排序，把范围一步步缩小。",
    resultsEyebrow: "目录结果",
    resultsTitle: "全部收录内容",
    resultsDescription:
      "每张卡片都会提供名称、摘要、分类和外部入口，方便你快速判断要不要点进去继续看。",
  };
};

const buildResourceLinks = (item: SkillListItem) =>
  [
    item.doc_url
      ? {
          href: item.doc_url,
          label: "官方文档",
        }
      : null,
    item.github_url
      ? {
          href: item.github_url,
          label: "GitHub",
        }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string }>;

const FilterField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="powerup-filter-field">
    <span>{label}</span>
    {children}
  </label>
);

const CardVisual = ({ item }: { item: SkillListItem }) => {
  const fallbackIcon = getSkillFallbackIcon(item);

  return (
    <div className="powerup-card-visual" aria-hidden="true">
      <span className="powerup-card-visual-token powerup-card-visual-token-a">⭐</span>
      <span className="powerup-card-visual-token powerup-card-visual-token-b">🪙</span>
      <div className="powerup-card-visual-frame">
        {item.icon && !item.icon.startsWith("http") ? (
          <span className="powerup-card-visual-emoji">{item.icon}</span>
        ) : item.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon}
            alt=""
            className="powerup-card-visual-image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="powerup-card-visual-emoji">{fallbackIcon}</span>
        )}
      </div>
    </div>
  );
};

const SkillCard = ({ item }: { item: SkillListItem }) => {
  const visibleTags = item.tags.slice(0, 3);
  const hiddenTagCount = Math.max(item.tags.length - visibleTags.length, 0);
  const visiblePlatforms = item.supported_platforms.slice(0, 2);
  const resourceLinks = buildResourceLinks(item);

  return (
    <Card className="powerup-directory-card h-full py-0">
      <CardContent className="px-4 pt-4">
        <CardVisual item={item} />
      </CardContent>
      <CardHeader className="gap-4 border-b border-[rgba(126,99,222,0.12)] px-5 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className="powerup-card-chip powerup-card-chip-accent">
            {SKILL_TYPE_LABELS[item.type]}
          </span>
          <p className="powerup-meta-text">更新于 {formatUpdatedAt(item.updated_at)}</p>
        </div>
        <div className="space-y-2.5">
          <CardTitle className="text-xl text-[var(--powerup-ink-title)]">
            <Link href={`/skill/${item.slug}`} className="powerup-card-title-link">
              {item.name}
            </Link>
          </CardTitle>
          <p className="powerup-card-context">
            <span>{CATEGORY_LABELS[item.category]}</span>
            <span>作者 {item.author}</span>
            {item.license ? <span>许可 {item.license}</span> : null}
          </p>
          <CardDescription className="powerup-card-summary line-clamp-3">
            {item.summary}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-5 py-5">
        {visiblePlatforms.length > 0 ? (
          <div className="powerup-card-support-block">
            <p className="powerup-card-support-label">支持平台</p>
            <div className="powerup-card-chip-row">
              {visiblePlatforms.map((platform) => (
                <span key={platform} className="powerup-meta-pill">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {visibleTags.length > 0 ? (
          <div className="powerup-card-support-block">
            <p className="powerup-card-support-label">关键词</p>
            <div className="powerup-card-chip-row">
              {visibleTags.map((tag) => (
                <span key={tag} className="powerup-card-chip powerup-card-chip-soft">
                  #{tag}
                </span>
              ))}
              {hiddenTagCount > 0 ? (
                <span className="powerup-card-chip powerup-card-chip-muted">
                  +{hiddenTagCount}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {visiblePlatforms.length === 0 && visibleTags.length === 0 ? (
          <p className="powerup-card-empty-note">
            这条内容暂时没有补充平台或关键词信息，可以进入详情页继续了解。
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="powerup-card-actions px-5 py-4">
        <div className="powerup-card-action-group">
          <Button asChild className="powerup-button-primary powerup-button-small">
            <Link href={`/skill/${item.slug}`}>查看详情</Link>
          </Button>
          {resourceLinks.length > 0 ? (
            <div className="powerup-card-secondary-links">
              {resourceLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                  <ExternalLink className="size-3.5" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

const EmptyState = ({
  pathname,
  variant = "home",
}: {
  pathname: string;
  variant?: SkillDirectoryProps["variant"];
}) => {
  const title = variant === "category" ? "这个分类下暂时没有匹配结果" : "没有找到匹配结果";
  const description =
    variant === "category"
      ? "这个分类下暂时没有符合条件的内容。你可以放宽页内筛选，或回到首页换个关键词继续找。"
      : "这次没有找到符合条件的内容。你可以重置筛选，或换个关键词再试一次。";
  const resetLabel = variant === "category" ? "清空页内筛选" : "查看全部结果";

  return (
      <Card className="powerup-empty-state py-0 text-center">
      <CardHeader className="items-center px-6 py-8">
        <p className="powerup-eyebrow">暂时没有结果</p>
        <CardTitle className="text-2xl text-[var(--powerup-ink-title)]">{title}</CardTitle>
        <CardDescription className="max-w-lg text-base leading-7 text-zinc-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center gap-3 border-t border-[rgba(126,99,222,0.12)] bg-transparent px-6 py-5">
        <Button asChild className="powerup-button-secondary powerup-button-link">
          <Link href={pathname}>{resetLabel}</Link>
        </Button>
        {pathname !== "/" ? (
          <Button asChild className="powerup-button-primary powerup-button-link">
            <Link href="/">返回首页搜索</Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

const PaginationControl = ({
  href,
  direction,
  disabled,
}: {
  href: string;
  direction: "previous" | "next";
  disabled: boolean;
}) => {
  const label = direction === "previous" ? "上一页" : "下一页";
  const icon =
    direction === "previous" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />;

  if (disabled) {
    return (
      <span className="powerup-pager-disabled" aria-disabled="true">
        {direction === "previous" ? (
          <>
            {icon}
            {label}
          </>
        ) : (
          <>
            {label}
            {icon}
          </>
        )}
      </span>
    );
  }

  return (
    <Button asChild className="powerup-button-secondary powerup-button-link powerup-pager-button">
      <Link href={href}>
        {direction === "previous" ? (
          <>
            {icon}
            {label}
          </>
        ) : (
          <>
            {label}
            {icon}
          </>
        )}
      </Link>
    </Button>
  );
};

const Pagination = ({
  pathname,
  result,
  allowCategoryFilter,
}: SkillDirectoryProps) => {
  if (result.totalPages <= 1) {
    return null;
  }

  const previousHref = buildDirectoryHref({
    pathname,
    filters: result.filters,
    overrides: {
      page: result.page - 1,
    },
    includeCategory: allowCategoryFilter,
  });
  const nextHref = buildDirectoryHref({
    pathname,
    filters: result.filters,
    overrides: {
      page: result.page + 1,
    },
    includeCategory: allowCategoryFilter,
  });

  return (
    <nav aria-label="分页" className="powerup-pager">
      <PaginationControl
        href={previousHref}
        direction="previous"
        disabled={!result.hasPreviousPage}
      />

      <div className="powerup-pager-status">
        <p className="powerup-meta-text">分页进度</p>
        <p className="powerup-pager-status-text">
          第 <span>{result.page}</span> 页 / 共 <span>{result.totalPages}</span> 页
        </p>
      </div>

      <PaginationControl href={nextHref} direction="next" disabled={!result.hasNextPage} />
    </nav>
  );
};

export const SkillDirectory = ({
  pathname,
  result,
  allowCategoryFilter,
  variant = "home",
}: SkillDirectoryProps) => {
  const filterSummaryItems = getFilterSummaryItems(result.filters, allowCategoryFilter);
  const copy = getDirectoryCopy(variant);

  return (
    <section id="directory" className="flex flex-col gap-6">
      <div className="powerup-panel powerup-panel-soft">
        <div className="powerup-panel-header">
          <div className="space-y-2">
            <p className="powerup-eyebrow">筛选工具</p>
            <CardTitle className="flex items-center gap-2 text-2xl text-[var(--powerup-ink-title)]">
              <Filter className="size-4 text-[#ef6d56]" />
              筛选与排序
            </CardTitle>
            <CardDescription className="powerup-section-copy max-w-3xl">
              {copy.filterDescription}
            </CardDescription>
          </div>
        </div>

        <div className="powerup-filters-toolbar">
          <div className="powerup-filter-summary" aria-label="当前筛选状态">
            {filterSummaryItems.map((item) => (
              <span key={item} className="powerup-summary-pill">
                {item}
              </span>
            ))}
          </div>
          <div className="powerup-filter-toolbar-meta">
            <span className="powerup-meta-text">
              已找到 {result.totalItems} 条结果
              {result.totalPages > 1 ? `，共 ${result.totalPages} 页` : ""}
            </span>
            <Button asChild className="powerup-button-ghost powerup-button-link">
              <Link href={pathname}>
                <RotateCcw className="size-3.5" />
                重置条件
              </Link>
            </Button>
          </div>
        </div>

        <form
          action={pathname}
          method="get"
          className={cn(
            "powerup-filters-grid",
            allowCategoryFilter
              ? "lg:grid-cols-[1fr_1fr_1fr_auto]"
              : "lg:grid-cols-[1fr_1fr_auto]",
          )}
        >
          {result.filters.q ? <input type="hidden" name="q" value={result.filters.q} /> : null}
          <FilterField label="类型">
            <select
              name="type"
              defaultValue={result.filters.type ?? ""}
              className="powerup-form-control"
            >
              <option value="">全部类型</option>
              {(
                [
                  ["skill", SKILL_TYPE_LABELS.skill],
                  ["mcp_server", SKILL_TYPE_LABELS.mcp_server],
                ] as const satisfies readonly [SkillType, string][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FilterField>

          {allowCategoryFilter ? (
            <FilterField label="分类">
              <select
                name="category"
                defaultValue={result.filters.category ?? ""}
                className="powerup-form-control"
              >
                <option value="">全部分类</option>
                {CATEGORY_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {CATEGORY_LABELS[slug]}
                  </option>
                ))}
              </select>
            </FilterField>
          ) : null}

          <FilterField label="排序">
            <select
              name="sort"
              defaultValue={result.filters.sort}
              className="powerup-form-control"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FilterField>

          <div className="powerup-filter-actions">
            <p className="powerup-meta-text">调整条件后即可查看新的结果。</p>
            <Button type="submit" className="powerup-button-primary h-12 w-full lg:w-auto">
              应用筛选
            </Button>
          </div>
        </form>
      </div>

      <div className="powerup-results-header">
        <div className="space-y-2">
          <p className="powerup-eyebrow">{copy.resultsEyebrow}</p>
          <h2 className="powerup-section-title">{copy.resultsTitle}</h2>
          <p className="powerup-section-copy">{copy.resultsDescription}</p>
        </div>
        <p className="powerup-meta-text">
          共 <span className="font-semibold text-[var(--powerup-ink-strong)]">{result.totalItems}</span> 条结果
          {result.totalPages > 1 ? `，共 ${result.totalPages} 页` : ""}。
        </p>
      </div>

      {result.items.length > 0 ? (
        <ul className="powerup-directory-grid">
          {result.items.map((item) => (
            <li key={item.slug} className="min-w-0">
              <SkillCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState pathname={pathname} variant={variant} />
      )}

      <Pagination
        pathname={pathname}
        result={result}
        allowCategoryFilter={allowCategoryFilter}
      />
    </section>
  );
};
