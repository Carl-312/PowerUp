import path from "node:path";
import { readFile } from "node:fs/promises";

export const ABOUT_DOCUMENT_SLUG = "about";
export const ABOUT_DOCUMENT_TITLE = "目录说明";

export const readAboutContent = () =>
  readFile(path.join(process.cwd(), "src/content/about.md"), "utf8");
