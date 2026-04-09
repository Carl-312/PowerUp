import type { LoaderFunctionArgs } from "react-router-dom";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";

import { fetchPowerUpApi, PowerUpApiRequestError } from "../lib/api";
import {
  POWERUP_CATEGORY_LABELS,
  POWERUP_CATEGORY_SLUGS,
  type PowerUpContentDocumentPayload,
  type PowerUpSkillDetailPayload,
  type PowerUpSkillDirectoryPagePayload,
} from "../lib/contracts";
import { AppShell } from "../components/app-shell";
import { HomePage } from "../pages/home-page";

const readSearch = (request: Request) => new URL(request.url).search;

const ensureKnownCategory = (category: string | undefined) => {
  if (!category || !POWERUP_CATEGORY_SLUGS.includes(category as never)) {
    throw new Response("Category not found", {
      status: 404,
      statusText: "Category not found",
    });
  }

  return category;
};

const homeLoader = ({ request }: LoaderFunctionArgs) =>
  fetchPowerUpApi<PowerUpSkillDirectoryPagePayload>(`/skills${readSearch(request)}`, {
    signal: request.signal,
  });

const categoryLoader = ({ request, params }: LoaderFunctionArgs) => {
  const category = ensureKnownCategory(params.category);
  const url = new URL(request.url);

  url.searchParams.set("category", category);

  return fetchPowerUpApi<PowerUpSkillDirectoryPagePayload>(
    `/skills?${url.searchParams.toString()}`,
    {
      signal: request.signal,
    },
  );
};

const skillDetailLoader = ({ request, params }: LoaderFunctionArgs) => {
  if (!params.slug) {
    throw new Response("Skill not found", {
      status: 404,
      statusText: "Skill not found",
    });
  }

  return fetchPowerUpApi<PowerUpSkillDetailPayload>(`/skills/${params.slug}`, {
    signal: request.signal,
  });
};

const aboutLoader = ({ request }: LoaderFunctionArgs) =>
  fetchPowerUpApi<PowerUpContentDocumentPayload>("/content/about", {
    signal: request.signal,
  });

const HydrateFallback = () => (
  <div className="page-stack">
    <section className="panel panel-glow">
      <p className="eyebrow">Loading Wonder World</p>
      <h1>正在载入首页内容</h1>
      <p>如果后端暂时不可用，前端会自动切到本地演示数据，不会再只剩背景。</p>
    </section>
  </div>
);

const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="page-stack">
        <section className="panel">
          <p className="eyebrow">Route Error</p>
          <h1>{error.status}</h1>
          <p>{error.statusText || "页面加载失败。"}</p>
        </section>
      </div>
    );
  }

  const message =
    error instanceof PowerUpApiRequestError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unexpected frontendv2 error.";

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">Unexpected Error</p>
        <h1>请求失败</h1>
        <p>{message}</p>
      </section>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppShell,
    ErrorBoundary,
    HydrateFallback,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: HomePage,
      },
      {
        path: "category/:category",
        loader: categoryLoader,
        lazy: () => import("../pages/category-page"),
        handle: {
          title: POWERUP_CATEGORY_LABELS,
        },
      },
      {
        path: "skill/:slug",
        loader: skillDetailLoader,
        lazy: () => import("../pages/skill-detail-page"),
      },
      {
        path: "about",
        loader: aboutLoader,
        lazy: () => import("../pages/about-page"),
      },
    ],
  },
]);
