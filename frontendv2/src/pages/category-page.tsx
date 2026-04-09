import { Link, useLoaderData, useParams } from "react-router-dom";

import { DirectoryControls } from "../components/directory-controls";
import { SkillCard } from "../components/skill-card";
import { WonderScene } from "../components/wonder-scene";
import {
  POWERUP_CATEGORY_LABELS,
  type PowerUpCategorySlug,
  type PowerUpSkillDirectoryPagePayload,
} from "../lib/contracts";
import { buildDirectoryHref } from "../lib/routing";

const sortLabels = {
  updated_desc: "最近更新优先",
  name_asc: "名称 A-Z",
} as const;

export const CategoryPage = () => {
  const data = useLoaderData() as PowerUpSkillDirectoryPagePayload;
  const { category } = useParams();
  const categorySlug = category as PowerUpCategorySlug;
  const categoryLabel = POWERUP_CATEGORY_LABELS[categorySlug];

  return (
    <div className="page-stack">
      <section className="hero-world hero-world-compact">
        <div className="hero-copy">
          <Link className="secondary-link secondary-link-ghost" to="/">
            返回首页
          </Link>
          <p className="eyebrow">Category World</p>
          <h1>{categoryLabel}</h1>
          <p className="hero-lead">
            保留分类路径语义，但把这一页整理成更像单独关卡海报的阅读顺序: 先给你当前世界的上下文，再进入筛选工具和目录结果。
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#category-results">
              查看结果
            </a>
            <Link className="secondary-link secondary-link-ghost" to="/about">
              了解 API 边界
            </Link>
          </div>

          <div className="detail-meta-grid">
            <article className="stat-card stat-card-compact">
              <span>结果</span>
              <strong>{data.directory.pagination.totalItems}</strong>
              <p>当前分类在这一轮筛选下落出来的目录结果。</p>
            </article>
            <article className="stat-card stat-card-compact">
              <span>页码</span>
              <strong>{data.directory.pagination.page}</strong>
              <p>当前位置，方便继续翻页浏览。</p>
            </article>
            <article className="stat-card stat-card-compact">
              <span>排序</span>
              <strong>{sortLabels[data.directory.filters.sort]}</strong>
              <p>沿用目录 API 的排序能力，不改后端契约。</p>
            </article>
          </div>
        </div>

        <WonderScene
          badge="Category Portal"
          caption="每个分类都像一张独立地图，保留 API 驱动但拥有更鲜明的情绪。"
          title={categoryLabel}
          variant="category"
        />
      </section>

      <DirectoryControls
        action={`/category/${categorySlug}`}
        allowCategoryFilter={false}
        filters={data.directory.filters}
        resultCount={data.directory.pagination.totalItems}
      />

      <section className="panel panel-glow deferred-section" id="category-results">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Category Results</p>
            <h2>分类结果</h2>
            <p className="panel-copy">锁定分类上下文后，目录卡片继续维持统一的 Wonder 世界语言，但把信息密度压到更容易扫描的节奏。</p>
          </div>
          <p className="meta-text">共 {data.directory.pagination.totalItems} 条结果</p>
        </div>

        {data.directory.items.length > 0 ? (
          <div className="cards-grid">
            {data.directory.items.map((item) => (
              <SkillCard item={item} key={item.slug} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>这个分类下还没有公开结果</h3>
            <p>可以返回首页或调整类型/排序条件。</p>
          </div>
        )}

        <nav className="pager">
          {data.directory.pagination.hasPreviousPage ? (
            <a
              href={buildDirectoryHref(`/category/${categorySlug}`, data.directory.filters, {
                allowCategoryFilter: false,
                overrides: {
                  page: data.directory.pagination.page - 1,
                },
              })}
            >
              上一页
            </a>
          ) : (
            <span className="pager-disabled">上一页</span>
          )}

          <span className="meta-text">
            第 {data.directory.pagination.page} / {data.directory.pagination.totalPages || 1} 页
          </span>

          {data.directory.pagination.hasNextPage ? (
            <a
              href={buildDirectoryHref(`/category/${categorySlug}`, data.directory.filters, {
                allowCategoryFilter: false,
                overrides: {
                  page: data.directory.pagination.page + 1,
                },
              })}
            >
              下一页
            </a>
          ) : (
            <span className="pager-disabled">下一页</span>
          )}
        </nav>
      </section>
    </div>
  );
};

export const Component = CategoryPage;
