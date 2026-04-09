import {
  POWERUP_CATEGORY_LABELS,
  POWERUP_CATEGORY_SLUGS,
  POWERUP_SKILL_TYPE_LABELS,
  POWERUP_SKILL_TYPES,
  type PowerUpListFilters,
} from "../lib/contracts";

interface DirectoryControlsProps {
  action: string;
  filters: PowerUpListFilters;
  allowCategoryFilter: boolean;
  resultCount?: number;
  showQueryField?: boolean;
}

const sortLabels = {
  updated_desc: "最近更新优先",
  name_asc: "名称 A-Z",
} as const;

export const DirectoryControls = ({
  action,
  filters,
  allowCategoryFilter,
  resultCount,
  showQueryField = false,
}: DirectoryControlsProps) => {
  const isCompactLayout = !showQueryField && !allowCategoryFilter;
  const summaryItems = [
    filters.q ? `关键词 · ${filters.q}` : null,
    `类型 · ${filters.type ? POWERUP_SKILL_TYPE_LABELS[filters.type] : "全部类型"}`,
    filters.category ? `分类 · ${POWERUP_CATEGORY_LABELS[filters.category]}` : null,
    `排序 · ${sortLabels[filters.sort]}`,
  ].filter(Boolean) as string[];

  return (
    <section className="panel panel-controls deferred-section">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Warp Filters</p>
          <h2>筛选与排序</h2>
          <p className="panel-copy">把搜索、筛选和结果概览收成一条更清楚的工具带，减少块与块之间的互相争抢。</p>
        </div>
      </div>

      <div className="filters-toolbar">
        <div className="filters-summary" aria-label="当前筛选状态">
          {summaryItems.map((item) => (
            <span className="summary-pill" key={item}>
              {item}
            </span>
          ))}
        </div>

        <div className="control-action-row">
          <span className="meta-text">
            {resultCount !== undefined ? `当前视图 ${resultCount} 条结果` : "切换条件后会重新拉取当前视图。"}
          </span>
          <a className="secondary-link secondary-link-ghost" href={action}>
            重置关卡
          </a>
        </div>
      </div>

      <form
        action={action}
        className={`filters-grid${isCompactLayout ? " filters-grid-compact" : ""}`}
        method="get"
      >
        {showQueryField ? (
          <label className="field">
            <span>关键词</span>
            <input
              defaultValue={filters.q ?? ""}
              name="q"
              placeholder="搜索公开条目"
              type="search"
            />
          </label>
        ) : null}

        <label className="field">
          <span>类型</span>
          <select defaultValue={filters.type ?? ""} name="type">
            <option value="">全部类型</option>
            {POWERUP_SKILL_TYPES.map((type) => (
              <option key={type} value={type}>
                {POWERUP_SKILL_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        {allowCategoryFilter ? (
          <label className="field">
            <span>分类</span>
            <select defaultValue={filters.category ?? ""} name="category">
              <option value="">全部分类</option>
              {POWERUP_CATEGORY_SLUGS.map((category) => (
                <option key={category} value={category}>
                  {POWERUP_CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="field">
          <span>排序</span>
          <select defaultValue={filters.sort} name="sort">
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="field button-field">
          <span className="field-caption">确认条件后再进入目录结果</span>
          <button className="primary-button" type="submit">
            应用筛选
          </button>
        </div>
      </form>
    </section>
  );
};
