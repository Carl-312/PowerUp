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
import { cn } from "@/lib/utils";
import { SKILL_TYPE_LABELS, type SkillListItem, type SkillType } from "@/types/skill";

const sortLabels: Record<SkillSort, string> = {
  updated_desc: "最近更新优先",
  name_asc: "名称 A-Z",
};

const controlClassName =
  "h-11 w-full rounded-2xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

interface SkillDirectoryProps {
  pathname: string;
  result: SkillListResult;
  allowCategoryFilter: boolean;
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

const formatUpdatedAt = (value: number) => dateFormatter.format(new Date(value * 1000));

const getActiveFilterSummary = (
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

  if (filters.category) {
    chips.push(
      allowCategoryFilter
        ? `分类 ${CATEGORY_LABELS[filters.category]}`
        : `固定分类 ${CATEGORY_LABELS[filters.category]}`,
    );
  }

  if (filters.sort !== DEFAULT_SKILL_SORT) {
    chips.push(`排序 ${sortLabels[filters.sort]}`);
  }

  return chips;
};

const SkillCard = ({ item }: { item: SkillListItem }) => {
  const visibleTags = item.tags.slice(0, 4);
  const visiblePlatforms = item.supported_platforms.slice(0, 2);

  return (
    <Card className="h-full rounded-[28px] border-none bg-white/90 py-0 shadow-sm ring-1 ring-zinc-950/8">
      <CardHeader className="gap-4 border-b border-zinc-100 px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">
              {SKILL_TYPE_LABELS[item.type]}
            </span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700">
              {CATEGORY_LABELS[item.category]}
            </span>
          </div>
          <p className="text-xs text-zinc-500">更新于 {formatUpdatedAt(item.updated_at)}</p>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg text-zinc-950">{item.name}</CardTitle>
          <CardDescription className="line-clamp-3 text-sm leading-6 text-zinc-600">
            {item.summary}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5 px-5 py-5">
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        <dl className="grid gap-2 text-sm text-zinc-700">
          <div className="flex gap-3">
            <dt className="w-14 shrink-0 text-zinc-500">作者</dt>
            <dd>{item.author}</dd>
          </div>
          {item.license ? (
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-zinc-500">许可</dt>
              <dd>{item.license}</dd>
            </div>
          ) : null}
          {visiblePlatforms.length > 0 ? (
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-zinc-500">平台</dt>
              <dd className="flex flex-wrap gap-2">
                {visiblePlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700"
                  >
                    {platform}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/70 px-5 py-4">
        <span className="text-xs text-zinc-500">{item.slug}</span>
        <div className="flex flex-wrap gap-2">
          {item.doc_url ? (
            <Button asChild variant="outline" size="sm" className="rounded-full border-zinc-200">
              <a href={item.doc_url} target="_blank" rel="noreferrer">
                文档
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          ) : null}
          {item.github_url ? (
            <Button asChild variant="ghost" size="sm" className="rounded-full text-zinc-700">
              <a href={item.github_url} target="_blank" rel="noreferrer">
                GitHub
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

const EmptyState = ({ pathname }: { pathname: string }) => (
  <Card className="rounded-[28px] border-none bg-white/90 py-0 text-center shadow-sm ring-1 ring-zinc-950/8">
    <CardHeader className="items-center px-6 py-8">
      <CardTitle className="text-2xl">没有找到匹配结果</CardTitle>
      <CardDescription className="max-w-lg text-base leading-7">
        当前条件下没有已发布条目。可以重置筛选，或者回到首页重新输入关键词。
      </CardDescription>
    </CardHeader>
    <CardFooter className="justify-center gap-3 border-t border-zinc-100 bg-zinc-50/80 px-6 py-5">
      <Button asChild variant="outline" className="rounded-full border-zinc-200">
        <Link href={pathname}>清空当前筛选</Link>
      </Button>
      {pathname !== "/" ? (
        <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
          <Link href="/">返回首页搜索</Link>
        </Button>
      ) : null}
    </CardFooter>
  </Card>
);

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
    <nav
      aria-label="分页"
      className="flex flex-col gap-4 rounded-[28px] border border-zinc-200 bg-white/85 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      {result.hasPreviousPage ? (
        <Button asChild variant="outline" className="rounded-full border-zinc-200">
          <Link href={previousHref}>
            <ChevronLeft className="size-4" />
            上一页
          </Link>
        </Button>
      ) : (
        <span className="inline-flex h-9 items-center rounded-full border border-zinc-200 px-4 text-sm text-zinc-400">
          <ChevronLeft className="mr-1 size-4" />
          上一页
        </span>
      )}

      <p className="text-sm text-zinc-600">
        第 <span className="font-medium text-zinc-950">{result.page}</span> /{" "}
        <span className="font-medium text-zinc-950">{result.totalPages}</span> 页
      </p>

      {result.hasNextPage ? (
        <Button asChild variant="outline" className="rounded-full border-zinc-200">
          <Link href={nextHref}>
            下一页
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <span className="inline-flex h-9 items-center rounded-full border border-zinc-200 px-4 text-sm text-zinc-400">
          下一页
          <ChevronRight className="ml-1 size-4" />
        </span>
      )}
    </nav>
  );
};

export const SkillDirectory = ({
  pathname,
  result,
  allowCategoryFilter,
}: SkillDirectoryProps) => {
  const activeFilterSummary = getActiveFilterSummary(result.filters, allowCategoryFilter);

  return (
    <section id="directory" className="flex flex-col gap-6">
      <Card className="rounded-[28px] border-none bg-white/90 py-0 shadow-sm ring-1 ring-zinc-950/8">
        <CardHeader className="gap-3 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl text-zinc-950">
                <Filter className="size-4 text-amber-700" />
                筛选与排序
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-zinc-600">
                首页支持关键词、类型、分类、排序与分页；分类页保留固定分类上下文。
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="rounded-full text-zinc-600">
              <Link href={pathname}>
                <RotateCcw className="size-3.5" />
                重置
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form
            action={pathname}
            method="get"
            className={cn(
              "grid gap-4",
              allowCategoryFilter
                ? "lg:grid-cols-[1fr_1fr_1fr_auto]"
                : "lg:grid-cols-[1fr_1fr_auto]",
            )}
          >
            {result.filters.q ? <input type="hidden" name="q" value={result.filters.q} /> : null}
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              类型
              <select
                name="type"
                defaultValue={result.filters.type ?? ""}
                className={controlClassName}
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
            </label>

            {allowCategoryFilter ? (
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                分类
                <select
                  name="category"
                  defaultValue={result.filters.category ?? ""}
                  className={controlClassName}
                >
                  <option value="">全部分类</option>
                  {CATEGORY_SLUGS.map((slug) => (
                    <option key={slug} value={slug}>
                      {CATEGORY_LABELS[slug]}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              排序
              <select name="sort" defaultValue={result.filters.sort} className={controlClassName}>
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <Button
                type="submit"
                className="h-11 w-full rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 lg:w-auto"
              >
                应用筛选
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            已发布目录
          </h2>
          <p className="text-sm text-zinc-600">
            当前共 <span className="font-medium text-zinc-950">{result.totalItems}</span> 条结果
            {result.totalPages > 1 ? `，共 ${result.totalPages} 页` : ""}。
          </p>
        </div>
        {activeFilterSummary.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeFilterSummary.map((item) => (
              <span
                key={item}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-900"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {result.items.length > 0 ? (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result.items.map((item) => (
            <li key={item.slug} className="min-w-0">
              <SkillCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState pathname={pathname} />
      )}

      <Pagination
        pathname={pathname}
        result={result}
        allowCategoryFilter={allowCategoryFilter}
      />
    </section>
  );
};
