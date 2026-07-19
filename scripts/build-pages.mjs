import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const result = spawnSync(process.execPath, [nextBin, "build"], {
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_SITE_ORIGIN: "https://yeeeson.github.io",
    NEXT_PUBLIC_BASE_PATH: "/hsinchu-weekend-dashboard",
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
