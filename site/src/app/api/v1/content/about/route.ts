import {
  ABOUT_DOCUMENT_SLUG,
  ABOUT_DOCUMENT_TITLE,
  readAboutContent,
} from "@/lib/content/about";
import { jsonError, jsonOk } from "@/lib/api/response";
import { toContentDocumentPayload } from "@/lib/api/serializers";

export async function GET() {
  try {
    const markdown = await readAboutContent();

    return jsonOk(
      toContentDocumentPayload({
        slug: ABOUT_DOCUMENT_SLUG,
        title: ABOUT_DOCUMENT_TITLE,
        markdown,
      }),
    );
  } catch {
    return jsonError(500, "about_content_failed", "Failed to load about content.");
  }
}
