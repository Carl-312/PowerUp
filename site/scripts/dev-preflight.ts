import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readlinkSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const DEFAULT_DEV_PORT = 3000;
const LOCKFILE_PATH = path.join(".next", "dev", "lock");
const TERMINATION_GRACE_MS = 1200;
const TERMINATION_POLL_MS = 150;

interface LockfileInfo {
  pid: number;
  port?: number;
  hostname?: string;
  appUrl?: string;
  startedAt?: number;
}

interface ProcessInfo {
  pid: number;
  ppid: number;
  stat: string;
  command: string;
  cwd?: string;
}

const parseRequestedPort = (forwardedArgs: string[]) => {
  const envPort = process.env.PORT;

  if (envPort) {
    const parsed = Number.parseInt(envPort, 10);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  for (let index = 0; index < forwardedArgs.length; index += 1) {
    const value = forwardedArgs[index];

    if (value === "--port" || value === "-p") {
      const candidate = forwardedArgs[index + 1];
      const parsed = candidate ? Number.parseInt(candidate, 10) : Number.NaN;

      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }

    if (value.startsWith("--port=")) {
      const parsed = Number.parseInt(value.slice("--port=".length), 10);

      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return DEFAULT_DEV_PORT;
};

const processExists = (pid: number) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const isZombieProcess = (processInfo?: ProcessInfo) =>
  processInfo?.stat?.startsWith("Z") ?? false;

const readLockfile = (projectRoot: string) => {
  const lockfilePath = path.join(projectRoot, LOCKFILE_PATH);

  if (!existsSync(lockfilePath)) {
    return null;
  }

  try {
    const raw = readFileSync(lockfilePath, "utf8");
    return JSON.parse(raw) as LockfileInfo;
  } catch (error) {
    console.warn(`[dev:preflight] 无法读取锁文件 ${lockfilePath}，将继续启动。`);
    console.warn(error);
    return null;
  }
};

const readProcessCwd = (pid: number) => {
  try {
    return path.resolve(readlinkSync(`/proc/${pid}/cwd`));
  } catch {
    return undefined;
  }
};

const readProcessTable = () => {
  const output = execFileSync("ps", ["-eo", "pid=,ppid=,stat=,args="], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  const table = new Map<number, ProcessInfo>();

  for (const line of output.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    const match = trimmed.match(/^(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/);

    if (!match) {
      continue;
    }

    const pid = Number.parseInt(match[1], 10);
    const ppid = Number.parseInt(match[2], 10);

    table.set(pid, {
      pid,
      ppid,
      stat: match[3],
      command: match[4],
      cwd: readProcessCwd(pid),
    });
  }

  return table;
};

const isSameProjectProcess = (processInfo: ProcessInfo, projectRoot: string) =>
  processInfo.cwd === projectRoot || processInfo.command.includes(projectRoot);

const isNextDevelopmentProcess = (command: string) =>
  command.includes("next/dist/bin/next dev") ||
  command.includes(" next dev") ||
  command.includes("next-server") ||
  command.includes(`${path.sep}.next${path.sep}dev${path.sep}`);

const collectDescendants = (
  rootPid: number,
  table: Map<number, ProcessInfo>,
  projectRoot: string,
  accumulator: Set<number>,
) => {
  for (const processInfo of table.values()) {
    if (processInfo.ppid !== rootPid || accumulator.has(processInfo.pid)) {
      continue;
    }

    if (!isSameProjectProcess(processInfo, projectRoot)) {
      continue;
    }

    accumulator.add(processInfo.pid);
    collectDescendants(processInfo.pid, table, projectRoot, accumulator);
  }
};

const collectLockfileProcessTree = (
  table: Map<number, ProcessInfo>,
  projectRoot: string,
  lockPid: number,
) => {
  const related = new Set<number>();
  let currentPid: number | undefined = lockPid;

  while (currentPid) {
    const processInfo = table.get(currentPid);

    if (!processInfo) {
      break;
    }

    if (!isSameProjectProcess(processInfo, projectRoot)) {
      break;
    }

    if (!isNextDevelopmentProcess(processInfo.command) && currentPid !== lockPid) {
      break;
    }

    related.add(currentPid);
    currentPid = processInfo.ppid > 1 ? processInfo.ppid : undefined;
  }

  for (const pid of [...related]) {
    collectDescendants(pid, table, projectRoot, related);
  }

  return related;
};

const readListeningPidsForPort = (port: number) => {
  try {
    const output = execFileSync("lsof", ["-tiTCP:${port}".replace("${port}", String(port)), "-sTCP:LISTEN"], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    return output
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isFinite(value));
  } catch {
    return [];
  }
};

const killPids = async (pids: number[]) => {
  if (pids.length === 0) {
    return [];
  }

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGCONT");
    } catch {
      // ignore
    }
  }

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // ignore
    }
  }

  const deadline = Date.now() + TERMINATION_GRACE_MS;

  while (Date.now() < deadline) {
    const refreshedTable = readProcessTable();
    const alive = pids.filter((pid) => {
      const processInfo = refreshedTable.get(pid);
      return processExists(pid) && !isZombieProcess(processInfo);
    });

    if (alive.length === 0) {
      return [];
    }

    await delay(TERMINATION_POLL_MS);
  }

  const refreshedTable = readProcessTable();
  const remaining = pids.filter((pid) => {
    const processInfo = refreshedTable.get(pid);
    return processExists(pid) && !isZombieProcess(processInfo);
  });

  for (const pid of remaining) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // ignore
    }
  }

  await delay(TERMINATION_POLL_MS);

  const finalTable = readProcessTable();

  return remaining.filter((pid) => {
    const processInfo = finalTable.get(pid);
    return processExists(pid) && !isZombieProcess(processInfo);
  });
};

const cleanupLockArtifacts = (projectRoot: string) => {
  const lockfilePath = path.join(projectRoot, LOCKFILE_PATH);

  if (existsSync(lockfilePath)) {
    rmSync(lockfilePath, { force: true });
  }
};

export const runDevPreflight = async ({
  projectRoot,
  forwardedArgs,
}: {
  projectRoot: string;
  forwardedArgs: string[];
}) => {
  const requestedPort = parseRequestedPort(forwardedArgs);
  const lockInfo = readLockfile(projectRoot);
  const table = readProcessTable();
  const relatedPids = new Set<number>();
  const warnedPortPids: number[] = [];

  const lockProcessInfo = lockInfo?.pid ? table.get(lockInfo.pid) : undefined;

  if (lockInfo?.pid && processExists(lockInfo.pid) && !isZombieProcess(lockProcessInfo)) {
    const lockTree = collectLockfileProcessTree(table, projectRoot, lockInfo.pid);

    for (const pid of lockTree) {
      relatedPids.add(pid);
    }
  }

  const relatedPorts = [...new Set([requestedPort, lockInfo?.port].filter(Boolean) as number[])];

  for (const port of relatedPorts) {
    for (const pid of readListeningPidsForPort(port)) {
      const processInfo = table.get(pid);

      if (!processInfo) {
        continue;
      }

      if (
        isSameProjectProcess(processInfo, projectRoot) ||
        isNextDevelopmentProcess(processInfo.command)
      ) {
        relatedPids.add(pid);
      } else {
        warnedPortPids.push(pid);
      }
    }
  }

  if (warnedPortPids.length > 0) {
    console.warn(
      `[dev:preflight] 发现端口 ${relatedPorts.join(", ")} 上有非当前项目进程占用，未自动终止：${[
        ...new Set(warnedPortPids),
      ].join(", ")}`,
    );
  }

  const orderedPids = [...relatedPids].sort((left, right) => right - left);

  if (orderedPids.length > 0) {
    console.log(`[dev:preflight] 正在清理旧的 Next 开发进程: ${orderedPids.join(", ")}`);
    const stillAlive = await killPids(orderedPids);

    if (stillAlive.length > 0) {
      throw new Error(
        `[dev:preflight] 这些进程仍未退出，请手动检查后再启动: ${stillAlive.join(", ")}`,
      );
    }

    console.log("[dev:preflight] 已完成旧开发进程清理。");
  }

  if (!lockInfo?.pid || !processExists(lockInfo.pid) || isZombieProcess(lockProcessInfo)) {
    cleanupLockArtifacts(projectRoot);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void runDevPreflight({
    projectRoot: process.cwd(),
    forwardedArgs: process.argv.slice(2),
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
