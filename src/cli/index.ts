#!/usr/bin/env node
/**
 * pretty-py-errors CLI
 *
 *   pyright --outputjson | pretty-py-errors
 *   mypy . | pretty-py-errors --lang ja
 *   pretty-py-errors report.json
 */
import { readFileSync } from "node:fs";
import { toAnsi } from "../core/format";
import { resolveLocale } from "../core/i18n";
import { parseAny } from "../core/inputs";

const HELP = `pretty-py-errors — make Python type errors human-readable

Usage:
  pyright --outputjson | pretty-py-errors [options]
  pyright | pretty-py-errors [options]
  mypy . | pretty-py-errors [options]
  pretty-py-errors <file> [options]

Options:
  --lang <code>       Language: en, zh-TW, zh-CN, ja, ko (default: from $LANG)
  --no-color          Disable colors (also honours NO_COLOR)
  --no-hint           Hide fix hints
  --width <n>         Wrap long types at this width (default: 60)
  -h, --help          Show this help
`;

function main(argv: string[]): number {
  const args = [...argv];
  let lang: string | undefined;
  let color = !process.env.NO_COLOR && process.stdout.isTTY !== false;
  let hint = true;
  let width = 60;
  let file: string | undefined;

  while (args.length) {
    const a = args.shift()!;
    if (a === "-h" || a === "--help") {
      process.stdout.write(HELP);
      return 0;
    } else if (a === "--lang") lang = args.shift();
    else if (a.startsWith("--lang=")) lang = a.slice(7);
    else if (a === "--no-color") color = false;
    else if (a === "--color") color = true;
    else if (a === "--no-hint") hint = false;
    else if (a === "--width") width = Number(args.shift()) || 60;
    else if (!a.startsWith("-")) file = a;
    else {
      process.stderr.write(`Unknown option: ${a}\n\n${HELP}`);
      return 2;
    }
  }

  if (!file && process.stdin.isTTY) {
    process.stdout.write(HELP);
    return 0;
  }

  const text = readFileSync(file ?? 0, "utf8");
  const envLang = (process.env.LC_ALL || process.env.LANG || "en").split(".")[0].replace("_", "-");
  const locale = resolveLocale(lang, envLang);
  const diagnostics = parseAny(text);

  if (diagnostics.length === 0) {
    process.stdout.write(text);
    return 0;
  }

  const blocks = diagnostics.map((d) =>
    toAnsi(d, {
      locale,
      color,
      width,
      showHint: hint,
      location: d.file ? `${d.file}${d.line ? ":" + d.line : ""}${d.column ? ":" + d.column : ""}` : undefined,
    }),
  );
  process.stdout.write(blocks.join("\n\n") + "\n");
  const errors = diagnostics.filter((d) => d.severity === "error").length;
  process.stdout.write(`\n${errors} error(s), ${diagnostics.length - errors} other\n`);
  return errors > 0 ? 1 : 0;
}

// Exit quietly when piped into `head` and the like.
process.stdout.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EPIPE") process.exit(process.exitCode ?? 0);
  throw err;
});

process.exitCode = main(process.argv.slice(2));
