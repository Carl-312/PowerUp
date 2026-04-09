import { Link, useLoaderData } from "react-router-dom";

import { RichMarkdown } from "../components/rich-markdown";
import { WonderScene } from "../components/wonder-scene";
import {
  POWERUP_CATEGORY_LABELS,
  POWERUP_SKILL_TYPE_LABELS,
  type PowerUpSkillDetailPayload,
} from "../lib/contracts";
import { formatUpdatedAt } from "../lib/format";

export const SkillDetailPage = () => {
  const data = useLoaderData() as PowerUpSkillDetailPayload;
  const { item } = data;
  const hasAside = item.tags.length > 0 || Boolean(item.doc_url) || Boolean(item.github_url);
  const sceneMascot =
    item.icon && !item.icon.startsWith("http")
      ? item.icon
      : item.type === "mcp_server"
        ? "🌟"
        : "🍄";

  return (
    <div className="page-stack">
      <section className="hero-world hero-world-detail">
        <div className="hero-copy">
          <Link className="secondary-link secondary-link-ghost" to="/">
            返回目录
          </Link>
          <div className="chip-row">
            <span className="chip chip-accent">{POWERUP_SKILL_TYPE_LABELS[item.type]}</span>
            <span className="chip">{POWERUP_CATEGORY_LABELS[item.category]}</span>
            <span className="chip">{item.slug}</span>
          </div>
          <h1>{item.name}</h1>
          <p className="hero-lead">{item.summary}</p>

          <div className="hero-actions">
            {item.doc_url ? (
              <a className="primary-link" href={item.doc_url} rel="noreferrer" target="_blank">
                官方文档
              </a>
            ) : (
              <a className="primary-link" href="#skill-body">
                查看详细描述
              </a>
            )}
            {item.github_url ? (
              <a
                className="secondary-link secondary-link-ghost"
                href={item.github_url}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            ) : null}
          </div>

          <div className="detail-meta-grid">
            <article className="stat-card stat-card-compact">
              <span>作者</span>
              <strong>{item.author}</strong>
              <p>当前条目的主要维护者。</p>
            </article>
            <article className="stat-card stat-card-compact">
              <span>更新时间</span>
              <strong>{formatUpdatedAt(item.updated_at)}</strong>
              <p>最近一次同步到目录的时间。</p>
            </article>
            {item.license ? (
              <article className="stat-card stat-card-compact">
                <span>许可</span>
                <strong>{item.license}</strong>
                <p>当前公开展示的许可协议。</p>
              </article>
            ) : null}
          </div>

          {item.supported_platforms.length > 0 ? (
            <div className="feature-pills">
              {item.supported_platforms.map((platform) => (
                <span className="meta-pill" key={platform}>
                  {platform}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <WonderScene
          badge="Skill Stage"
          caption="把单个技能详情做成更像角色卡或关卡介绍页，信息密度保留，但观感更轻快。"
          mascot={sceneMascot}
          title={item.name}
          variant="detail"
        />
      </section>

      <div className={`detail-layout deferred-section${hasAside ? "" : " detail-layout-single"}`}>
        <section className="panel panel-glow detail-main-panel" id="skill-body">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Description</p>
              <h2>详细描述</h2>
              <p className="panel-copy">先读核心说明，再继续往下看接入方式与配置示例，避免详情页一上来就被辅助信息淹没。</p>
            </div>
          </div>
          <RichMarkdown content={item.description} />
        </section>

        {hasAside ? (
          <aside className="detail-aside">
            {item.tags.length > 0 ? (
              <section className="panel panel-glow">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Collectibles</p>
                    <h2>标签与线索</h2>
                  </div>
                </div>
                <div className="feature-pills">
                  {item.tags.map((tag) => (
                    <span className="chip chip-soft" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {(item.doc_url || item.github_url) ? (
              <section className="panel panel-glow">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Links</p>
                    <h2>外部链接</h2>
                  </div>
                </div>

                <div className="link-grid">
                  {item.doc_url ? (
                    <a className="link-card" href={item.doc_url} rel="noreferrer" target="_blank">
                      <strong>官方文档</strong>
                      <span>{item.doc_url}</span>
                    </a>
                  ) : null}
                  {item.github_url ? (
                    <a className="link-card" href={item.github_url} rel="noreferrer" target="_blank">
                      <strong>GitHub</strong>
                      <span>{item.github_url}</span>
                    </a>
                  ) : null}
                </div>
              </section>
            ) : null}
          </aside>
        ) : null}
      </div>

      {item.install_guide || item.config_example ? (
        <section className="panel panel-glow deferred-section">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Integration</p>
              <h2>接入与配置</h2>
              <p className="panel-copy">把安装步骤和配置示例放到正文之后，阅读时先理解能力边界，再进入实现细节。</p>
            </div>
          </div>

          {item.install_guide ? (
            <div className="stack-gap">
              <h3>安装 / 接入方式</h3>
              <RichMarkdown content={item.install_guide} />
            </div>
          ) : null}

          {item.config_example ? (
            <div className="stack-gap">
              <h3>配置示例</h3>
              <RichMarkdown content={item.config_example} />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
};

export const Component = SkillDetailPage;
