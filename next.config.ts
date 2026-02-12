import type { NextConfig } from "next";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFromFile(relPath: string): Record<string, string> {
  const p = resolve(process.cwd(), relPath);
  if (!existsSync(p)) return {};
  try {
    const content = readFileSync(p, "utf8");
    const env: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
    return env;
  } catch {
    return {};
  }
}

function loadAppEnv(): Record<string, string> {
  return { ...loadEnvFromFile(".env.local"), ...loadEnvFromFile("app/.env.local") };
}

const nextConfig: NextConfig = {
  env: loadAppEnv(),
};

export default nextConfig;
