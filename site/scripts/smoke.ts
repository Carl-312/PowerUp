import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { parse } from "node:url";

import BetterSqlite3 from "better-sqlite3";

const packageManagerExecutable = process.env.npm_execpath
  ? process.execPath
  : process.platform === "win32"
    ? "npm.cmd"
    : "npm";
const packageManagerArgs = process.env.npm_execpath
  ? [process.env.npm_execpath]
  : [];

const tempDir = mkdtempSync(path.join(os.tmpdir(), "powerup-smoke-"));
const databaseUrl = path.join(tempDir, "powerup.smoke.db");
const host = "127.0.0.1";

const smokeEnv: NodeJS.ProcessEnv = {
  ...process.env,
  DATABASE_URL: databaseUrl,
  NEXT_TELEMETRY_DISABLED: "1",
};

const run = (args: string[], env: NodeJS.ProcessEnv = process.env) => {
  const commandArgs = [...packageManagerArgs, ...args];
  const result = spawnSync(packageManagerExecutable, commandArgs, {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `Command failed: ${packageManagerExecutable} ${commandArgs.join(" ")}`,
    );
  }
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const getAvailablePort = () =>
  new Promise<number>((resolve, reject) => {
    const server = net.createServer();

    server.unref();
    server.on("error", reject);
    server.listen(0, host, () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Failed to allocate a local smoke-test port."));
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(address.port);
      });
    });
  });

const insertDraftFixture = () => {
  const sqlite = new BetterSqlite3(databaseUrl);
  const now = Math.floor(Date.now() / 1000);

  try {
    sqlite
      .prepare(
        `
          INSERT INTO skills (
            name,
            slug,
            type,
            icon,
            summary,
            description,
            category,
            tags,
            author,
            license,
            github_url,
            doc_url,
            install_guide,
            config_example,
            supported_platforms,
            source_url,
            source_kind,
            last_verified_at,
            review_status,
            created_at,
            updated_at
          ) VALUES (
            @name,
            @slug,
            @type,
            @icon,
            @summary,
            @description,
            @category,
            @tags,
            @author,
            @license,
            @github_url,
            @doc_url,
            @install_guide,
            @config_example,
            @supported_platforms,
            @source_url,
            @source_kind,
            @last_verified_at,
            @review_status,
            @created_at,
            @updated_at
          )
          ON CONFLICT(slug) DO UPDATE SET
            name = excluded.name,
            type = excluded.type,
            icon = excluded.icon,
            summary = excluded.summary,
            description = excluded.description,
            category = excluded.category,
            tags = excluded.tags,
            author = excluded.author,
            license = excluded.license,
            github_url = excluded.github_url,
            doc_url = excluded.doc_url,
            install_guide = excluded.install_guide,
            config_example = excluded.config_example,
            supported_platforms = excluded.supported_platforms,
            source_url = excluded.source_url,
            source_kind = excluded.source_kind,
            last_verified_at = excluded.last_verified_at,
            review_status = excluded.review_status,
            updated_at = excluded.updated_at
        `,
      )
      .run({
        name: "Smoke Hidden Draft",
        slug: "smoke-hidden-draft",
        type: "skill",
        icon: null,
        summary: "Draft-only record that should stay hidden from public pages.",
        description:
          "This unpublished fixture exists only to verify public route visibility rules.",
        category: "developer-tools",
        tags: JSON.stringify(["smoke", "draft", "hidden"]),
        author: "Smoke Test",
        license: null,
        github_url: null,
        doc_url: null,
        install_guide: null,
        config_example: null,
        supported_platforms: JSON.stringify(["test"]),
        source_url: "https://example.com/smoke-hidden-draft",
        source_kind: "github_repo",
        last_verified_at: now,
        review_status: "draft",
        created_at: now,
        updated_at: now,
      });
  } finally {
    sqlite.close();
  }
};

const fetchPage = async (baseUrl: string, route: string) => {
  const response = await fetch(`${baseUrl}${route}`, {
    redirect: "manual",
  });
  const html = await response.text();

  return {
    response,
    html,
  };
};

const fetchJson = async (baseUrl: string, route: string) => {
  const response = await fetch(`${baseUrl}${route}`, {
    headers: {
      Accept: "application/json",
    },
    redirect: "manual",
  });
  const json = await response.json();

  return {
    response,
    json,
  };
};

const expectIncludes = (html: string, value: string, message: string) => {
  assert.ok(html.includes(value), `${message} Missing text: ${value}`);
};

const expectExcludes = (html: string, value: string, message: string) => {
  assert.ok(!html.includes(value), `${message} Unexpected text: ${value}`);
};

const runAssertions = async (baseUrl: string) => {
  const home = await fetchPage(baseUrl, "/");
  assert.equal(home.response.status, 200, "Home page should render successfully.");
  expectIncludes(home.html, "发现好用能力", "Home page should render the hero section.");
  expectIncludes(home.html, "Everything MCP Server", "Home page should show published results.");
  expectExcludes(home.html, "Smoke Hidden Draft", "Home page must not expose draft entries.");

  const search = await fetchPage(baseUrl, "/?q=everything");
  assert.equal(search.response.status, 200, "Search results should render on the home page.");
  assert.equal(
    new URL(search.response.url).pathname,
    "/",
    "Search requests must stay on the home route.",
  );
  assert.equal(
    new URL(search.response.url).searchParams.get("q"),
    "everything",
    "Search query should remain on the home route.",
  );
  expectIncludes(search.html, "搜索词", "Home search should render the active query state.");
  expectIncludes(search.html, "Everything MCP Server", "Search should keep matching published entries visible.");

  const category = await fetchPage(
    baseUrl,
    "/category/developer-tools?q=algorithmic&type=skill",
  );
  assert.equal(category.response.status, 200, "Category page should render successfully.");
  expectIncludes(
    category.html,
    "分类浏览",
    "Category page should render the locked-category context.",
  );
  expectIncludes(
    category.html,
    "MCP Builder Skill",
    "Category page should keep the fixed category results visible.",
  );
  expectExcludes(
    category.html,
    'name="category"',
    "Category page should not render an in-page category selector.",
  );
  expectExcludes(
    category.html,
    "Algorithmic Art Skill",
    "Category page should not leak entries from other categories.",
  );

  const detail = await fetchPage(baseUrl, "/skill/everything-mcp");
  assert.equal(detail.response.status, 200, "Published detail page should render successfully.");
  expectIncludes(detail.html, "Everything MCP Server", "Published detail page should show the selected entry.");
  expectIncludes(detail.html, "基础信息", "Published detail page should render detail metadata.");

  const directoryApi = await fetchJson(baseUrl, "/api/v1/skills?q=everything");
  assert.equal(directoryApi.response.status, 200, "Directory API should respond successfully.");
  assert.equal(directoryApi.json.meta.version, "v1", "Directory API should expose the API version.");
  assert.equal(
    directoryApi.json.data.directory.items[0]?.slug,
    "everything-mcp",
    "Directory API should return the published matching record.",
  );
  assert.ok(
    directoryApi.json.data.categories.totalPublished >= directoryApi.json.data.directory.items.length,
    "Directory API should include category counts for the independent frontend.",
  );

  const detailApi = await fetchJson(baseUrl, "/api/v1/skills/everything-mcp");
  assert.equal(detailApi.response.status, 200, "Detail API should respond successfully.");
  assert.equal(
    detailApi.json.data.item.slug,
    "everything-mcp",
    "Detail API should expose the selected published record.",
  );

  const categoriesApi = await fetchJson(baseUrl, "/api/v1/categories");
  assert.equal(categoriesApi.response.status, 200, "Categories API should respond successfully.");
  assert.ok(
    categoriesApi.json.data.totalPublished > 0,
    "Categories API should expose published totals.",
  );

  const aboutApi = await fetchJson(baseUrl, "/api/v1/content/about");
  assert.equal(aboutApi.response.status, 200, "About content API should respond successfully.");
  assert.equal(
    aboutApi.json.data.slug,
    "about",
    "About content API should expose the document slug.",
  );
  assert.ok(
    typeof aboutApi.json.data.markdown === "string" &&
      aboutApi.json.data.markdown.length > 0,
    "About content API should return markdown content.",
  );

  const hiddenSearch = await fetchPage(baseUrl, "/?q=smoke hidden draft");
  assert.equal(hiddenSearch.response.status, 200, "Draft search should still render the home results page.");
  expectIncludes(
    hiddenSearch.html,
    "没有找到匹配结果",
    "Draft-only search terms should not expose unpublished entries.",
  );
  expectExcludes(
    hiddenSearch.html,
    "Smoke Hidden Draft",
    "Draft-only entries must stay hidden from search results.",
  );

  const hiddenDetail = await fetchPage(baseUrl, "/skill/smoke-hidden-draft");
  assert.equal(hiddenDetail.response.status, 404, "Unpublished detail pages must return 404.");

  const hiddenDetailApi = await fetchJson(baseUrl, "/api/v1/skills/smoke-hidden-draft");
  assert.equal(hiddenDetailApi.response.status, 404, "Unpublished detail API requests must return 404.");
  assert.equal(
    hiddenDetailApi.json.error.code,
    "skill_not_found",
    "Detail API should return a stable not-found error code.",
  );

  const missingDetail = await fetchPage(baseUrl, "/skill/does-not-exist");
  assert.equal(missingDetail.response.status, 404, "Missing detail pages must return 404.");
};

const startServer = async (port: number) => {
  const { default: next } = await import("next");
  const app = next({
    dev: false,
    dir: process.cwd(),
    hostname: host,
    port,
  });

  await app.prepare();

  const handle = app.getRequestHandler();
  const server = createServer((request, response) => {
    const parsedUrl = parse(request.url ?? "/", true);
    void handle(request, response, parsedUrl);
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return {
    app,
    server,
  };
};

const closeServer = (server: Server) =>
  new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const closeLoadedSqlite = () => {
  const globalWithSqlite = globalThis as typeof globalThis & {
    __powerup_sqlite__?: BetterSqlite3.Database;
  };

  globalWithSqlite.__powerup_sqlite__?.close();
  Reflect.deleteProperty(globalWithSqlite, "__powerup_sqlite__");
};

const removeTempDirectory = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      rmSync(tempDir, { force: true, recursive: true });
      return;
    } catch {
      await sleep(200 * (attempt + 1));
    }
  }
};

const main = async () => {
  let server: Server | undefined;
  let app: { close?: () => Promise<void> | void } | undefined;

  process.env.DATABASE_URL = databaseUrl;
  process.env.NEXT_TELEMETRY_DISABLED = "1";

  console.log(`[smoke] Using isolated database: ${databaseUrl}`);

  try {
    run(["run", "db:push"], smokeEnv);
    run(["run", "db:seed"], smokeEnv);
    insertDraftFixture();
    run(["run", "build"], smokeEnv);

    const port = await getAvailablePort();
    const baseUrl = `http://${host}:${port}`;

    ({ server, app } = await startServer(port));
    await runAssertions(baseUrl);

    console.log(`[smoke] Page smoke checks passed against ${baseUrl}`);
  } finally {
    if (server) {
      await closeServer(server);
    }

    if (typeof app?.close === "function") {
      await app.close();
    }

    closeLoadedSqlite();
    await removeTempDirectory();
  }
};

main().catch((error) => {
  console.error("Smoke checks failed.");
  console.error(error);
  process.exitCode = 1;
});
