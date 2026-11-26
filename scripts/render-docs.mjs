#!/usr/bin/env node
// Regenerates the README screenshots in docs/ from the real Pyright output in test/fixtures.
// Run `npm run build` first.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const svg = (title, ansi) => execFileSync("node", ["scripts/ansi-to-svg.mjs", title], { input: ansi });
const cli = (...args) => {
  try {
    return execFileSync("node", ["out/src/cli/index.js", ...args, "--color", "--width", "56"], { encoding: "utf8" });
  } catch (err) {
    return err.stdout; // exit code 1 when errors are found
  }
};

mkdirSync("docs", { recursive: true });
const raw = readFileSync("test/fixtures/demo.txt", "utf8");
writeFileSync("docs/before.svg", svg("pyright examples/demo.py", raw));
writeFileSync("docs/after.svg", svg("pyright --outputjson examples/demo.py | pretty-py-errors", cli("test/fixtures/demo.json", "--lang", "en")));
writeFileSync("docs/after-zh-TW.svg", svg("pyright --outputjson examples/demo.py | pretty-py-errors --lang zh-TW", cli("test/fixtures/demo.json", "--lang", "zh-TW")));
console.log("Note: README.md uses PNG copies of before/after (the VS Code Marketplace rejects SVG images); re-export them after regenerating.");
console.log("wrote docs/before.svg, docs/after.svg, docs/after-zh-TW.svg");
