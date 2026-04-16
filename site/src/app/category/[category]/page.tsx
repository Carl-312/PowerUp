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
    description: `浏览 ${CATEGORY_LABELS[categorySlug]} 分类下的 Skill 与 MCP 条目，快速找到同一方向里值得继续了解的内容。`,
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
    <div className="flex flex-col gap-6 md:gap-7">
      <section className="powerup-panel powerup-panel-soft">
        <div className="flex flex-col gap-5">
          <div className="powerup-hero-actions">
            <Link href="/" className="powerup-button-ghost powerup-button-link">
              返回首页目录
            </Link>
            <Link href="#directory" className="powerup-button-secondary powerup-button-link">
              查看结果
            </Link>
          </div>

          <div className="space-y-3">
            <p className="powerup-eyebrow">分类浏览</p>
            <h1 className="powerup-page-title">{CATEGORY_LABELS[categorySlug]}</h1>
            <p className="powerup-section-copy max-w-3xl">
              这里聚合同一方向下的相关条目。你可以继续按类型筛选、调整排序，或逐页浏览，把范围一步步缩小到更贴合需求的结果。
            </p>
          </div>

          <div className="powerup-stat-grid">
            <article className="powerup-stat-card powerup-stat-card-compact">
              <span>Published</span>
              <strong>{result.totalItems}</strong>
              <p>这个分类下目前可浏览的结果。</p>
            </article>
            <article className="powerup-stat-card powerup-stat-card-compact">
              <span>Page</span>
              <strong>{result.page}</strong>
              <p>可以顺着分页继续往下看更多内容。</p>
            </article>
            <article className="powerup-stat-card powerup-stat-card-compact">
              <span>Sort</span>
              <strong>{filters.sort === "updated_desc" ? "最近更新" : "名称 A-Z"}</strong>
              <p>
                {filters.type
                  ? `目前只显示 ${SKILL_TYPE_LABELS[filters.type]} 类型。`
                  : "当前展示这个分类下的全部类型。"}
              </p>
            </article>
          </div>
        </div>
      </section>

      <SkillDirectory
        pathname={`/category/${categorySlug}`}
        result={result}
        allowCategoryFilter={false}
        variant="category"
      />
    </div>
  );
}
