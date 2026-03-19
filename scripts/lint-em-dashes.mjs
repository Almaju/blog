#!/usr/bin/env node
// Checks MDX prose for hyphens used as em dashes (e.g. "word - word").
// Code blocks and inline code are ignored.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function findMdxFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...findMdxFiles(full));
    } else if (entry.endsWith(".mdx")) {
      files.push(full);
    }
  }
  return files;
}

function stripCode(text) {
  // Replace fenced code blocks with whitespace (preserving line count)
  text = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, " "));
  // Replace inline code
  text = text.replace(/`[^`\n]+`/g, (m) => " ".repeat(m.length));
  return text;
}

const root = new URL("../content/docs", import.meta.url).pathname;
const files = findMdxFiles(root);
let errors = 0;

for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const stripped = stripCode(raw);
  const lines = stripped.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // [a-zA-Z,;:] - [a-zA-Z] catches "prose - prose" but not arithmetic or
    // markdown list bullets (those start the line with "- ")
    if (/[a-zA-Z,;:] - [a-zA-Z]/.test(line)) {
      const rel = file.replace(process.cwd() + "/", "");
      console.error(`${rel}:${i + 1}: hyphen used as em dash → ${line.trim()}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} violation(s). Use an em dash (—) instead.`);
  process.exit(1);
} else {
  console.log("No em-dash violations found.");
}
