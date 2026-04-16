import { spawn, spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

import BetterSqlite3 from "better-sqlite3";

import { runDevPreflight } from "./dev-preflight";

const DEFAULT_DATABASE_URL = path.join("data", "powerup.db");

const packageManagerExecutable = process.env.npm_execpath
  ? process.execPath
  : process.platform === "win32"
    ? "npm.cmd"
    : "npm";
const packageManagerArgs = process.env.npm_execpath ? [process.env.npm_execpath] : [];

const configuredDatabaseUrl = process.env.DATABASE_URL;
const resolvedDatabaseUrl = configuredDatabaseUrl ?? DEFAULT_DATABASE_URL;
const databasePath = path.isAbsolute(resolvedDatabaseUrl)
  ? resolvedDatabaseUrl
  : path.join(process.cwd(), resolvedDatabaseUrl);
const shouldAutoBootstrapDefaultDb = !configuredDatabaseUrl;
const forwardedArgs = process.argv.slice(2);
const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

const runNpmScript = (scriptName: string) => {
  const result = spawnSync(
    packageManagerExecutable,
    [...packageManagerArgs, "run", scriptName],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed while running npm script: ${scriptName}`);
  }
};

const inspectDatabase = () => {
  mkdirSync(path.dirname(databasePath), { recursive: true });

  const sqlite = new BetterSqlite3(databasePath);

  try {
    const skillsTableExists = Boolean(
      sqlite
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'skills'",
        )
        .get(),
    );

    const skillCount = skillsTableExists
      ? (
          sqlite
            .prepare("SELECT COUNT(*) as total FROM skills")
            .get() as { total: number }
        ).total
      : 0;

    return {
      skillsTableExists,
      skillCount,
    };
  } finally {
    sqlite.close();
  }
};

const ensureDevelopmentDatabase = () => {
  const { skillsTableExists, skillCount } = inspectDatabase();

  if (!skillsTableExists) {
    if (!shouldAutoBootstrapDefaultDb) {
      console.error(
        [
          "[dev] 当前 DATABASE_URL 指向的 SQLite 库还没有 `skills` 表。",
          `[dev] DATABASE_URL=${databasePath}`,
          "[dev] 先运行 `npm run db:push`，如需样例数据再运行 `npm run db:seed`，然后重新执行 `npm run dev`。",
        ].join("\n"),
      );
      process.exit(1);
    }

    console.log(`[dev] 检测到默认本地数据库缺少 schema，正在初始化: ${databasePath}`);
    runNpmScript("db:push");
    runNpmScript("db:seed");
    return;
  }

  if (shouldAutoBootstrapDefaultDb && skillCount === 0) {
    console.log(`[dev] 检测到默认本地数据库已建表但没有数据，正在写入样例数据: ${databasePath}`);
    runNpmScript("db:seed");
  }
};

const startNextDev = () => {
  const child = spawn(process.execPath, [nextBin, "dev", ...forwardedArgs], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
  });

  const forwardSignal = (signal: NodeJS.Signals) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on("SIGINT", () => forwardSignal("SIGINT"));
  process.on("SIGTERM", () => forwardSignal("SIGTERM"));

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });

  child.on("error", (error) => {
    console.error("[dev] Failed to start Next.js dev server.");
    console.error(error);
    process.exit(1);
  });
};

const main = async () => {
  await runDevPreflight({
    projectRoot: process.cwd(),
    forwardedArgs,
  });

  ensureDevelopmentDatabase();
  startNextDev();
};

void main().catch((error) => {
  console.error("[dev] 开发预检失败。");
  console.error(error);
  process.exit(1);
});
