import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";

import type BetterSqlite3 from "better-sqlite3";

import { seedSkills } from "@/db/seed-data";
import {
  DEFAULT_PAGE,
  DEFAULT_SKILL_SORT,
  type SkillListQueryInput,
} from "@/lib/validation";
import type { ReviewStatus, SkillSeedRecord } from "@/types/skill";

type DbModule = typeof import("@/db");
type SkillsQueriesModule = typeof import("@/lib/queries/skills");

const DEFAULT_LAST_VERIFIED_AT = 1_775_203_200;
const DEFAULT_CREATED_AT = 1_775_289_600;
const FIXTURE_CATEGORY = "business-finance";

const buildFixture = (
  index: number,
  overrides: Partial<SkillSeedRecord> = {},
): SkillSeedRecord => ({
  name: `Pagination Fixture ${String(index).padStart(2, "0")}`,
  slug: `pagination-fixture-${String(index).padStart(2, "0")}`,
  type: index % 2 === 0 ? "skill" : "mcp_server",
  summary: `Fixture summary ${index}`,
  description: `Fixture description ${index}`,
  category: FIXTURE_CATEGORY,
  tags: ["fixture", "pagination"],
  author: "Test Suite",
  supported_platforms: ["test"],
  source_url: `https://example.com/pagination-fixture-${index}`,
  source_kind: "github_repo",
  last_verified_at: DEFAULT_LAST_VERIFIED_AT,
  updated_at: DEFAULT_CREATED_AT + index,
  ...overrides,
});

const customSkillRecords: SkillSeedRecord[] = [
  buildFixture(0, {
    name: "Alpha Search Fixture",
    slug: "alpha-search-fixture",
    summary: "Search fixture with a distinct summary token",
    description: "Gamma token appears in the description.",
    tags: ["alpha", "search"],
    updated_at: DEFAULT_CREATED_AT + 50,
  }),
  buildFixture(1, {
    name: "Zulu Latest Fixture",
    slug: "zulu-latest-fixture",
    updated_at: DEFAULT_CREATED_AT + 100,
  }),
  ...Array.from({ length: 24 }, (_, index) => buildFixture(index + 2)),
  buildFixture(99, {
    name: "Hidden Draft Fixture",
    slug: "hidden-draft-fixture",
    summary: "Draft-only fixture",
    description: "This record should never be visible to published queries.",
    tags: ["draft", "hidden"],
    review_status: "draft",
    updated_at: DEFAULT_CREATED_AT + 999,
  }),
];

let tempDir = "";
let sqlite: BetterSqlite3.Database;
let queriesModule: SkillsQueriesModule;

const createFilters = (
  overrides: Partial<SkillListQueryInput> = {},
): SkillListQueryInput => ({
  sort: DEFAULT_SKILL_SORT,
  page: DEFAULT_PAGE,
  ...overrides,
});

const loadModule = async <T extends object>(modulePath: string): Promise<T> => {
  const importedModule = (await import(modulePath)) as Record<string, unknown>;

  if (
    Object.keys(importedModule).length === 1 &&
    "default" in importedModule &&
    typeof importedModule.default === "object" &&
    importedModule.default !== null
  ) {
    return importedModule.default as T;
  }

  return importedModule as T;
};

const createSkillsTable = (database: BetterSqlite3.Database) => {
  database.exec(`
    DROP TABLE IF EXISTS skills;

    CREATE TABLE skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      type TEXT NOT NULL,
      icon TEXT,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      author TEXT NOT NULL,
      license TEXT,
      github_url TEXT,
      doc_url TEXT,
      install_guide TEXT,
      config_example TEXT,
      supported_platforms TEXT NOT NULL DEFAULT '[]',
      source_url TEXT NOT NULL,
      source_kind TEXT NOT NULL,
      last_verified_at INTEGER NOT NULL,
      review_status TEXT NOT NULL DEFAULT 'draft',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE UNIQUE INDEX skills_slug_unique ON skills(slug);
    CREATE INDEX skills_type_idx ON skills(type);
    CREATE INDEX skills_category_idx ON skills(category);
    CREATE INDEX skills_review_status_idx ON skills(review_status);
    CREATE INDEX skills_updated_at_idx ON skills(updated_at);
  `);
};

const normalizeSeedSkill = (skill: SkillSeedRecord) => ({
  name: skill.name,
  slug: skill.slug,
  type: skill.type,
  icon: skill.icon ?? null,
  summary: skill.summary,
  description: skill.description,
  category: skill.category,
  tags: JSON.stringify(skill.tags),
  author: skill.author,
  license: skill.license ?? null,
  github_url: skill.github_url ?? null,
  doc_url: skill.doc_url ?? null,
  install_guide: skill.install_guide ?? null,
  config_example: skill.config_example ?? null,
  supported_platforms: JSON.stringify(skill.supported_platforms),
  source_url: skill.source_url,
  source_kind: skill.source_kind,
  last_verified_at: skill.last_verified_at,
  review_status: (skill.review_status ?? "published") as ReviewStatus,
  created_at: skill.created_at ?? DEFAULT_CREATED_AT,
  updated_at: skill.updated_at,
});

const seedDatabase = (database: BetterSqlite3.Database) => {
  const insertSkill = database.prepare(`
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
    );
  `);

  const rows = [...seedSkills, ...customSkillRecords].map(normalizeSeedSkill);
  const insertMany = database.transaction((records: typeof rows) => {
    for (const record of records) {
      insertSkill.run(record);
    }
  });

  insertMany(rows);
};

before(async () => {
  tempDir = mkdtempSync(path.join(os.tmpdir(), "powerup-queries-test-"));
  Object.assign(process.env, {
    DATABASE_URL: path.join(tempDir, "powerup.test.db"),
    NODE_ENV: "test",
  });

  const dbModule = await loadModule<DbModule>("@/db");
  sqlite = dbModule.sqlite;
  queriesModule = await loadModule<SkillsQueriesModule>("@/lib/queries/skills");

  createSkillsTable(sqlite);
  seedDatabase(sqlite);
});

after(() => {
  sqlite.close();
  Reflect.deleteProperty(globalThis, "__powerup_sqlite__");
  rmSync(tempDir, { force: true, recursive: true });
});

test("listSkills and detail helpers only expose published records", () => {
  const result = queriesModule.listSkills(
    createFilters({
      category: FIXTURE_CATEGORY,
    }),
  );

  assert.equal(result.totalItems, 26);
  assert.equal(result.totalPages, 2);
  assert.equal(result.page, 1);
  assert.equal(result.items.length, 24);
  assert.equal(result.hasNextPage, true);
  assert.equal(result.hasPreviousPage, false);
  assert.ok(result.items.every((item) => item.slug !== "hidden-draft-fixture"));
  assert.equal(queriesModule.getSkillBySlug("hidden-draft-fixture"), null);
  assert.ok(!queriesModule.getPublishedSlugs().includes("hidden-draft-fixture"));

  const businessFinanceCount = queriesModule
    .getCategoryCounts()
    .find((item) => item.slug === FIXTURE_CATEGORY);

  assert.equal(businessFinanceCount?.total, 26);
});

test("listSkills supports basic search across multiple fields", () => {
  const result = queriesModule.listSkills(
    createFilters({
      category: FIXTURE_CATEGORY,
      q: "alpha gamma",
    }),
  );

  assert.deepEqual(
    result.items.map((item) => item.slug),
    ["alpha-search-fixture"],
  );
});

test("listSkills preserves sorting choices and clamps pagination safely", () => {
  const updatedDesc = queriesModule.listSkills(
    createFilters({
      category: FIXTURE_CATEGORY,
    }),
  );
  const nameAsc = queriesModule.listSkills(
    createFilters({
      category: FIXTURE_CATEGORY,
      sort: "name_asc",
    }),
  );
  const clampedPage = queriesModule.listSkills(
    createFilters({
      category: FIXTURE_CATEGORY,
      page: 999,
    }),
  );

  assert.equal(updatedDesc.items[0]?.slug, "zulu-latest-fixture");
  assert.equal(nameAsc.items[0]?.slug, "alpha-search-fixture");
  assert.equal(clampedPage.page, 2);
  assert.equal(clampedPage.filters.page, 2);
  assert.equal(clampedPage.items.length, 2);
  assert.equal(clampedPage.hasPreviousPage, true);
  assert.equal(clampedPage.hasNextPage, false);
});
