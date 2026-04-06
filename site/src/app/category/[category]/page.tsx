import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SkillDirectory } from "@/components/skill-directory";
import { CATEGORY_LABELS, CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { listSkills } from "@/lib/queries/skills";
import { parseCategoryListQuery } from "@/lib/validation";
import { SKILL_TYPE_LABELS } from "@/types/skill";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: Pick<CategoryPageProps, "params">): Promise<Metadata> {
  const { category } = await params;

  if (!CATEGORY_SLUGS.includes(category as CategorySlug)) {
    notFound();
  }

  const categorySlug = category as CategorySlug;

  return {
    title: `${CATEGORY_LABELS[categorySlug]} 分类`,
    description: `浏览 ${CATEGORY_LABELS[categorySlug]} 分类下已发布的 Skill 与 MCP 条目，支持类型、排序与分页。`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;

  if (!CATEGORY_SLUGS.includes(category as CategorySlug)) {
    notFound();
  }

  const categorySlug = category as CategorySlug;
  const filters = parseCategoryListQuery(await searchParams, categorySlug);
  const result = listSkills(filters);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[32px] border border-zinc-200 bg-white/85 px-6 py-8 shadow-sm sm:px-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900">
            返回首页
          </Link>
          <div className="space-y-3">
            <span className="inline-flex w-fit rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium tracking-[0.16em] text-zinc-600 uppercase">
              Locked Category Context
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {CATEGORY_LABELS[categorySlug]}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-zinc-700">
              这里复用首页的目录列表体验，只显示当前分类下的已发布条目。页面内保留类型、排序和分页，不提供分类切换器。
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 text-sm text-zinc-600">
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
              共 {result.totalItems} 条已发布结果
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
              当前分类 {CATEGORY_LABELS[categorySlug]}
            </span>
            {filters.type ? (
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
                类型 {SKILL_TYPE_LABELS[filters.type]}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <SkillDirectory
        pathname={`/category/${categorySlug}`}
        result={result}
        allowCategoryFilter={false}
      />
    </div>
  );
}
