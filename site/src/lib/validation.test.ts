import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_PAGE,
  DEFAULT_SKILL_SORT,
  parseCategoryListQuery,
  parseHomeListQuery,
} from "@/lib/validation";

test("parseHomeListQuery normalizes supported URL search params", () => {
  const filters = parseHomeListQuery(
    new URLSearchParams([
      ["q", "  fetch   server  "],
      ["type", "mcp_server"],
      ["category", "search-information"],
      ["sort", "name_asc"],
      ["page", "2"],
    ]),
  );

  assert.deepEqual(filters, {
    q: "fetch server",
    type: "mcp_server",
    category: "search-information",
    sort: "name_asc",
    page: 2,
  });
});

test("parseHomeListQuery falls back on invalid values", () => {
  const filters = parseHomeListQuery({
    q: "   ",
    type: "invalid-type",
    category: "invalid-category",
    sort: "invalid-sort",
    page: "0",
  });

  assert.deepEqual(filters, {
    q: undefined,
    type: undefined,
    category: undefined,
    sort: DEFAULT_SKILL_SORT,
    page: DEFAULT_PAGE,
  });
});

test("parseCategoryListQuery keeps the fixed category context and ignores q", () => {
  const filters = parseCategoryListQuery(
    {
      q: "should be ignored",
      type: "skill",
      category: "other",
      sort: "name_asc",
      page: "3",
    },
    "developer-tools",
  );

  assert.deepEqual(filters, {
    q: undefined,
    type: "skill",
    category: "developer-tools",
    sort: "name_asc",
    page: 3,
  });
});
