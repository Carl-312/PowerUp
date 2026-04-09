import { Link, useLoaderData } from "react-router-dom";

import { RichMarkdown } from "../components/rich-markdown";
import { WonderScene } from "../components/wonder-scene";
import type { PowerUpContentDocumentPayload } from "../lib/contracts";

export const AboutPage = () => {
  const data = useLoaderData() as PowerUpContentDocumentPayload;

  return (
    <div className="page-stack">
      <section className="hero-world hero-world-compact">
        <div className="hero-copy">
          <p className="eyebrow">About Document</p>
          <h1>{data.title}</h1>
          <p className="hero-lead">
            这个页面已经不再从 `frontendv2` 本地复制文案，而是直接读取后端内容接口，方便后续继续把更多静态内容 API 化，同时保持统一的 Wonder 世界视觉。
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/">
              回到主地图
            </Link>
            <a className="secondary-link secondary-link-ghost" href="#about-content">
              继续阅读
            </a>
          </div>
        </div>

        <WonderScene
          badge="Story Room"
          caption="静态内容也能落在同一世界观里，不需要额外复制页面文案。"
          title="About PowerUp"
          variant="about"
        />
      </section>

      <section className="panel panel-glow deferred-section" id="about-content">
        <RichMarkdown content={data.markdown} />
      </section>
    </div>
  );
};

export const Component = AboutPage;
