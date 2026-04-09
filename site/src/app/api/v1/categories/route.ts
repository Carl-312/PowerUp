import { getCategoryCounts } from "@/lib/queries/skills";
import { jsonError, jsonOk } from "@/lib/api/response";
import { toCategoryCollectionPayload } from "@/lib/api/serializers";

export async function GET() {
  try {
    const categories = getCategoryCounts();

    return jsonOk(toCategoryCollectionPayload(categories));
  } catch {
    return jsonError(500, "categories_failed", "Failed to load categories.");
  }
}
