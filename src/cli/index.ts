#!/usr/bin/env node
/**
 * pretty-py-errors CLI
 *
 *   pyright --outputjson | pretty-py-errors
 *   mypy . | pretty-py-errors --lang ja
 *   mypy -O json . | pretty-py-errors
 *   pretty-py-errors report.json
 */
import { readFileSync } from "node:fs";
import { stripControlChars, toAnsi } from "../core/format";
import { resolveLocale } from "../core/i18n";
import { parseAny } from "../core/inputs";

const HELP = `pretty-py-errors — make Python type errors human-readable

Usage:
  pyright --outputjson | pretty-py-errors [options]
  pyright | pretty-py-errors [options]
  mypy . | pretty-py-errors [options]
  mypy -O json . | pretty-py-errors [options]
  pretty-py-errors <file> [options]

Options:
  --lang <code>       Language: en, zh-TW, zh-CN, ja, ko (default: from $LANG)
  --no-color          Disable colors (also honours NO_COLOR)
  --no-hint           Hide fix hints
  --width <n>         Wrap long types at this width (default: 60)
  -h, --help          Show this help
`;

const SUPPORTED_LANGS = ["en", "zh-TW", "zh-CN", "ja", "ko"];

function fail(message: string): number {
  process.stderr.write(`pretty-py-errors: ${message}\n`);
  return 2;
}

/**
 * Reads all of stdin. `readFileSync(0)` fails with EAGAIN when stdin is a
 * non-blocking pipe (e.g. `pyright | pretty-py-errors`), so read it as a stream.
 */
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function main(argv: string[]): Promise<number> {
  const args = [...argv];
  let lang: string | undefined;
  let color = !process.env.NO_COLOR && process.stdout.isTTY === true;
  let hint = true;
  let width = 60;
  let file: string | undefined;

  while (args.length) {
    const a = args.shift()!;
    if (a === "-h" || a === "--help") {
      process.stdout.write(HELP);
      return 0;
    } else if (a === "--lang" || a.startsWith("--lang=")) {
      lang = a === "--lang" ? args.shift() : a.slice(7);
      if (!lang || !SUPPORTED_LANGS.some((l) => l.toLowerCase() === lang!.toLowerCase())) {
        return fail(`--lang must be one of: ${SUPPORTED_LANGS.join(", ")}`);
      }
    } else if (a === "--no-color") color = false;
    else if (a === "--color") color = true;
    else if (a === "--no-hint") hint = false;
    else if (a === "--width") {
      width = Number(args.shift());
      if (!Number.isInteger(width) || width < 20) return fail("--width must be an integer of at least 20");
    } else if (!a.startsWith("-") && !file) file = a;
    else if (!a.startsWith("-")) return fail(`unexpected argument: ${a}`);
    else {
      process.stderr.write(`Unknown option: ${a}\n\n${HELP}`);
      return 2;
    }
  }

  if (!file && process.stdin.isTTY) {
    process.stdout.write(HELP);
    return 0;
  }

  let text: string;
  try {
    text = file ? readFileSync(file, "utf8") : await readStdin();
  } catch (err) {
    return fail(`cannot read ${file ?? "stdin"}: ${(err as Error).message}`);
  }

  const envLang = (process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || "en").split(".")[0];
  const locale = resolveLocale(lang, envLang);
  const diagnostics = parseAny(text);

  if (diagnostics === undefined) {
    // Not checker output we understand: pass it through unchanged.
    process.stdout.write(stripControlChars(text));
    return 0;
  }
  if (diagnostics.length === 0) {
    process.stdout.write((color ? "\u001b[32m✔\u001b[0m" : "✔") + " No problems found\n");
    return 0;
  }

  const blocks = diagnostics.map((d) =>
    toAnsi(d, {
      locale,
      color,
      width,
      showHint: hint,
      location: d.file ? stripControlChars(`${d.file}${d.line ? ":" + d.line : ""}${d.column ? ":" + d.column : ""}`) : undefined,
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

main(process.argv.slice(2)).then(
  (code) => {
    process.exitCode = code;
  },
  (err) => {
    process.stderr.write(`pretty-py-errors: ${(err as Error).stack ?? err}\n`);
    process.exitCode = 2;
  },
);
