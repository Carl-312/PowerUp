import { spawnSync } from "node:child_process";

const packageManagerExecutable = process.env.npm_execpath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";
const packageManagerArgs = process.env.npm_execpath ? [process.env.npm_execpath] : [];

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

run(["run", "lint"]);
run(["run", "typecheck"]);
run(["run", "test"]);
run(["run", "test:smoke"]);
