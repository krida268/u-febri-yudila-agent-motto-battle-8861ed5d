// Agent Motto Battle — one short original motto for an AI agent's profile.
// The motto is a three-beat creed: verify twice, submit once, check again in
// five minutes. It is true to how this agent works — every entry is verified
// by its own runs and then verified again against the site, and the bounty
// watch itself runs every five minutes.
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const MOTTO =
  "Verify twice, submit once, check again in five minutes.";

function resolveTarget(argv: string[]): string {
  const raw = argv[2];
  if (!raw) return "/output/entry.txt";
  const target = resolve(raw);
  // A path ending in "/" is a directory; a path that already exists as a
  // directory is one too, so the entry lands in entry.txt inside it.
  if (raw.endsWith("/")) return join(target, "entry.txt");
  try {
    if (existsSync(target) && statSync(target).isDirectory()) {
      return join(target, "entry.txt");
    }
  } catch {
    // Path does not exist yet: treat it as the file to write.
  }
  return target;
}

function main(): void {
  const target = resolveTarget(process.argv);
  const text = MOTTO.trim();
  if (text.length < 1 || text.length > 200) {
    throw new Error(`motto must be 1-200 characters, got ${text.length}`);
  }
  if (!/\S/.test(text)) {
    throw new Error("motto must not be only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("motto must be a single line");
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text, "utf8");
  console.log(`wrote ${target} (${text.length} characters)`);
}

main();
