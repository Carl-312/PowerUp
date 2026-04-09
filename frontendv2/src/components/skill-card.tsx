import { Link } from "react-router-dom";

import {
  POWERUP_CATEGORY_LABELS,
  POWERUP_SKILL_TYPE_LABELS,
  type PowerUpSkillListItem,
} from "../lib/contracts";
import { formatUpdatedAt } from "../lib/format";

interface SkillCardProps {
  item: PowerUpSkillListItem;
}

const categoryMascots = {
  "developer-tools": "🛠️",
  "data-analytics": "📈",
  "communication-collaboration": "💬",
  "content-writing": "✍️",
  "search-information": "🔍",
  "business-finance": "💰",
  "design-media": "🎨",
  "security-ops": "🛡️",
  "files-storage": "📦",
  other: "🧩",
} as const;

export const SkillCard = ({ item }: SkillCardProps) => (
  <article className="card wonder-card">
    <div className="card-visual">
      <span className="card-visual-spark card-visual-spark-a">⭐</span>
      <span className="card-visual-spark card-visual-spark-b">🪙</span>
      <div className="card-visual-frame">
        {item.icon && !item.icon.startsWith("http") ? (
          <span className="card-emoji" aria-hidden="true">
            {item.icon}
          </span>
        ) : item.icon ? (
          <img
            alt=""
            className="card-image"
            decoding="async"
            fetchPriority="low"
            loading="lazy"
            src={item.icon}
          />
        ) : (
          <span className="card-emoji" aria-hidden="true">
            {item.type === "mcp_server" ? "🌟" : categoryMascots[item.category]}
          </span>
        )}
      </div>
    </div>

    <div className="card-topline">
      <div className="chip-row">
        <span className="chip chip-accent">{POWERUP_SKILL_TYPE_LABELS[item.type]}</span>
        <span className="chip">{POWERUP_CATEGORY_LABELS[item.category]}</span>
      </div>
      <span className="meta-text">更新于 {formatUpdatedAt(item.updated_at)}</span>
    </div>

    <div className="card-body">
      <h3>
        <Link to={`/skill/${item.slug}`}>{item.name}</Link>
      </h3>
      <p className="card-summary">{item.summary}</p>
    </div>

    <dl className="meta-list card-meta-grid">
      <div>
        <dt>作者</dt>
        <dd>{item.author}</dd>
      </div>
      {item.license ? (
        <div>
          <dt>许可</dt>
          <dd>{item.license}</dd>
        </div>
      ) : null}
    </dl>

    {item.supported_platforms.length > 0 ? (
      <div className="chip-row chip-row-tight card-platform-row">
        {item.supported_platforms.slice(0, 2).map((platform) => (
          <span className="meta-pill" key={platform}>
            {platform}
          </span>
        ))}
      </div>
    ) : null}

    {item.tags.length > 0 ? (
      <div className="chip-row chip-row-tight card-tag-row">
        {item.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="chip chip-soft">
            #{tag}
          </span>
        ))}
      </div>
    ) : null}

    <div className="card-actions">
      <Link className="primary-link" to={`/skill/${item.slug}`}>
        查看详情
      </Link>
      <div className="card-secondary-links">
        {item.doc_url ? (
          <a href={item.doc_url} rel="noreferrer" target="_blank">
            官方文档
          </a>
        ) : null}
        {item.github_url ? (
          <a href={item.github_url} rel="noreferrer" target="_blank">
            GitHub
          </a>
        ) : null}
      </div>
    </div>
  </article>
);
