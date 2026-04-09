import { getSkillBySlug } from "@/lib/queries/skills";
import { jsonError, jsonOk } from "@/lib/api/response";
import { toSkillDetailPayload } from "@/lib/api/serializers";

interface SkillDetailRouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: SkillDetailRouteContext,
) {
  try {
    const { slug } = await params;
    const skill = getSkillBySlug(slug);

    if (!skill) {
      return jsonError(404, "skill_not_found", "Skill not found.");
    }

    return jsonOk(toSkillDetailPayload(skill));
  } catch {
    return jsonError(500, "skill_detail_failed", "Failed to load skill detail.");
  }
}
