import { Link, NavLink, Outlet, useSearchParams } from "react-router-dom";

export const AppShell = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <div className="shell">
      <header className="site-header">
        <div className="container header-grid">
          <div className="brand-block">
            <Link className="brand-mark" to="/">
              <span className="brand-orb">⭐</span>
              <span className="brand-lockup">
                <strong>PowerUp</strong>
                <small>Wonder Directory</small>
              </span>
            </Link>
            <p className="brand-copy">
              API-first 的目录前端外壳，把 Wonder 气质、信息层级和浏览效率放到同一张地图里。
            </p>
          </div>

          <nav className="nav-pills" aria-label="主导航">
            <NavLink className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")} to="/">
              首页
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}
              to="/category/developer-tools"
            >
              世界分区
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "nav-pill active" : "nav-pill")}
              to="/about"
            >
              关于
            </NavLink>
          </nav>

          <form action="/" className="header-search" method="get" role="search">
            <label className="header-search-field">
              <span className="header-search-icon" aria-hidden="true">
                🔎
              </span>
              <input
                aria-label="搜索 PowerUp 目录"
                className="search-input"
                defaultValue={query}
                name="q"
                placeholder="搜索名称、标签或描述"
                type="search"
              />
            </label>
            <button className="primary-button" type="submit">
              搜索
            </button>
          </form>
        </div>
      </header>

      <main className="container page-shell">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <section>
            <h2>前端壳层</h2>
            <p>这套 V2 只负责视觉、交互与 API 消费，让后续继续精修时不必回头耦合旧站实现。</p>
          </section>
          <section>
            <h2>数据边界</h2>
            <p>
              当前统一通过 <code>/api/v1</code> 读取目录列表、详情、分类统计和 About 文档。
            </p>
          </section>
          <section>
            <h2>世界 Buff</h2>
            <div className="footer-badge-row">
              <span className="footer-badge">🍄 Meme 2.5D</span>
              <span className="footer-badge">⭐ API-first</span>
              <span className="footer-badge">🪙 Vite + React</span>
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
};
