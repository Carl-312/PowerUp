import type { NextRequest } from "next/server";

import { getCategoryCounts, listSkills } from "@/lib/queries/skills";
import { parseHomeListQuery } from "@/lib/validation";
import { jsonError, jsonOk } from "@/lib/api/response";
import {
  toCategoryCollectionPayload,
  toSkillDirectoryPayload,
} from "@/lib/api/serializers";

export async function GET(request: NextRequest) {
  try {
    const filters = parseHomeListQuery(request.nextUrl.searchParams);
    const result = listSkills(filters);
    const categories = getCategoryCounts();

    return jsonOk({
      directory: toSkillDirectoryPayload(result),
      categories: toCategoryCollectionPayload(categories),
    });
  } catch {
    return jsonError(500, "skills_list_failed", "Failed to load skill directory.");
  }
}
