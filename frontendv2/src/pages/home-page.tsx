import { Link, useLoaderData } from "react-router-dom";

import { DirectoryControls } from "../components/directory-controls";
import { SkillCard } from "../components/skill-card";
import { WonderScene } from "../components/wonder-scene";
import type { PowerUpSkillDirectoryPagePayload } from "../lib/contracts";
import { buildDirectoryHref } from "../lib/routing";

export const HomePage = () => {
  const data = useLoaderData() as PowerUpSkillDirectoryPagePayload;
  const { directory, categories } = data;
  const populatedCategories = categories.items.filter((item) => item.total > 0);
  const featuredCategories = categories.items
    .filter((item) => item.total > 0)
    .sort((left, right) => right.total - left.total)
    .slice(0, 4);

  return (
    <div className="page-stack">
      <section className="hero-world hero-world-home">
        <div className="hero-copy">
          <div className="hero-kicker-row">
            <span className="hero-kicker">🍄 Wonder UI</span>
            <span className="hero-kicker hero-kicker-soft">⭐ API-first Shell</span>
          </div>
          <p className="eyebrow">PowerUp Frontend V2</p>
          <h1>把技能目录打磨成一张更成熟、更会呼吸的 Wonder 主视觉海报。</h1>
          <p className="hero-lead">
            保留 Mario Wonder 式的 2.5D 圆润、蘑菇金币星星和柔和梦幻氛围，但把排版层级、信息密度与
            API-first 壳层整理得更清楚，首页一眼就知道该往哪里继续探索。
          </p>

          <div className="hero-actions">
            <a className="primary-link" href="#directory-start">
              进入技能地图
            </a>
            <Link className="secondary-link secondary-link-ghost" to="/about">
              查看世界设定
            </Link>
          </div>

          <div className="hero-kicker-row">
            <span className="summary-pill">公开契约驱动</span>
            <span className="summary-pill">视觉层已与旧站解耦</span>
            <span className="summary-pill">支持继续迭代首页 / 分类 / 详情</span>
          </div>
        </div>

        <WonderScene
          badge="Meme Mushrooms"
          caption="蘑菇、金币和星星把目录入口收成一张更聚焦的 2.5D 海报，不再让每个区块都同样吵闹。"
          title="Jump Into PowerUp"
          variant="hero"
        />
      </section>

      <section className="stats-grid deferred-section" aria-label="目录统计概览">
        <article className="stat-card">
          <span>Published</span>
          <strong>{categories.totalPublished}</strong>
          <p>公开发布、可直接进入详情页浏览的技能条目。</p>
        </article>
        <article className="stat-card">
          <span>Worlds</span>
          <strong>{populatedCategories.length}</strong>
          <p>当前真正有内容、能继续深入探索的分类世界。</p>
        </article>
        <article className="stat-card">
          <span>Visible</span>
          <strong>{directory.pagination.totalItems}</strong>
          <p>当前筛选条件下，首页目录里直接可见的结果数。</p>
        </article>
      </section>

      <section className="terrain-strip deferred-section">
        <div>
          <p className="eyebrow">World Select</p>
          <h2>先挑一条更适合今天任务的冒险路线</h2>
          <p className="panel-copy">
            把主要分类做成清晰的世界入口，让浏览顺序从“先看主视觉”自然落到“再选路线”，而不是在很多同重量区块里来回游走。
          </p>
        </div>

        <div className="world-chip-grid">
          {featuredCategories.map((category) => (
            <Link className="world-chip" key={category.slug} to={`/category/${category.slug}`}>
              <span>{category.label}</span>
              <strong>{category.total}</strong>
              <small>published entries</small>
            </Link>
          ))}
        </div>
      </section>

      <DirectoryControls
        action="/"
        allowCategoryFilter
        filters={directory.filters}
        resultCount={directory.pagination.totalItems}
        showQueryField
      />

      <section className="panel panel-glow deferred-section" id="directory-start">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Published Directory</p>
            <h2>已发布目录</h2>
            <p className="panel-copy">保留原来的目录信息架构，但把阅读顺序、meta 信息和卡片密度重新压成更易扫读的节奏。</p>
          </div>
          <p className="meta-text">
            共 {directory.pagination.totalItems} 条结果
            {directory.filters.q ? `，关键词 “${directory.filters.q}”` : ""}
          </p>
        </div>

        {directory.items.length > 0 ? (
          <div className="cards-grid">
            {directory.items.map((item) => (
              <SkillCard item={item} key={item.slug} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>没有找到匹配结果</h3>
            <p>可以重置筛选，或者更换关键词重新尝试。</p>
          </div>
        )}

        <nav className="pager">
          {directory.pagination.hasPreviousPage ? (
            <a
              href={buildDirectoryHref("/", directory.filters, {
                allowCategoryFilter: true,
                overrides: {
                  page: directory.pagination.page - 1,
                },
              })}
            >
              上一页
            </a>
          ) : (
            <span className="pager-disabled">上一页</span>
          )}

          <span className="meta-text">
            第 {directory.pagination.page} / {directory.pagination.totalPages || 1} 页
          </span>

          {directory.pagination.hasNextPage ? (
            <a
              href={buildDirectoryHref("/", directory.filters, {
                allowCategoryFilter: true,
                overrides: {
                  page: directory.pagination.page + 1,
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

      <section className="callout-banner deferred-section">
        <div>
          <p className="eyebrow">Bonus Stage</p>
          <h2>这套新前端已经把视觉升级和后端数据边界彻底拆开了。</h2>
          <p>后面无论是继续补动效、压缩包体、重做目录组件，还是彻底替掉旧站视觉层，都不需要再回头耦合服务端查询逻辑。</p>
        </div>
        <Link className="primary-link" to="/about">
          查看 About API 页面
        </Link>
      </section>
    </div>
  );
};
