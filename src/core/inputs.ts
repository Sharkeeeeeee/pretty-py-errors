/** Parsers for checker output in the terminal: `pyright --outputjson`, plain pyright, and mypy. */
import { splitRule, type DiagnosticInput } from "./format";

export interface LocatedDiagnostic extends DiagnosticInput {
  file?: string;
  line?: number;
  column?: number;
}

type Severity = NonNullable<DiagnosticInput["severity"]>;

function normalizeSeverity(s: string): Severity {
  if (s === "warning") return "warning";
  if (s === "note" || s === "information") return "information";
  return "error";
}

export function parsePyrightJson(text: string): LocatedDiagnostic[] | undefined {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return undefined;
  }
  const diags = (data as { generalDiagnostics?: unknown[] })?.generalDiagnostics;
  if (!Array.isArray(diags)) return undefined;
  // The report may come from anywhere: validate every field instead of trusting its shape.
  const result: LocatedDiagnostic[] = [];
  for (const raw of diags) {
    if (!raw || typeof raw !== "object") continue;
    const d = raw as Record<string, unknown>;
    if (typeof d.message !== "string") continue;
    const start = (d.range as { start?: { line?: unknown; character?: unknown } } | undefined)?.start;
    const line = Number.isInteger(start?.line) ? (start!.line as number) + 1 : undefined;
    const column = Number.isInteger(start?.character) ? (start!.character as number) + 1 : undefined;
    result.push({
      checker: "pyright",
      message: d.message,
      rule: typeof d.rule === "string" ? d.rule : undefined,
      severity: normalizeSeverity(typeof d.severity === "string" ? d.severity : "error"),
      file: typeof d.file === "string" ? d.file : undefined,
      line,
      column,
    });
  }
  return result;
}

const PYRIGHT_LINE = /^\s*(.+?):(\d+):(\d+) - (error|warning|information): (.*)$/;

export function parsePyrightText(text: string): LocatedDiagnostic[] {
  const result: LocatedDiagnostic[] = [];
  let current: LocatedDiagnostic | undefined;
  // Continuation lines are indented by the header's indent plus Pyright's own
  // two-space nesting, so only the header's indent is removed.
  let headerIndent = 0;
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(PYRIGHT_LINE);
    if (m) {
      current = {
        checker: "pyright",
        file: m[1],
        line: Number(m[2]),
        column: Number(m[3]),
        severity: normalizeSeverity(m[4]),
        message: m[5],
      };
      headerIndent = line.length - line.trimStart().length;
      result.push(current);
    } else if (current && line.trim() && line.length - line.trimStart().length >= headerIndent + 2) {
      current.message += "\n" + line.slice(headerIndent);
    } else {
      current = undefined;
    }
  }
  return result;
}

// file:line[:col][:end_line:end_col]: severity: message  (--show-column-numbers / --show-error-end)
const MYPY_LINE = /^(.+?):(\d+)(?::(\d+))?(?::\d+:\d+)?: (error|warning|note): (.*)$/;
const MYPY_SUMMARY = /^(Found \d+ errors? in|Success: no issues found)/;

/**
 * Parses mypy's text output. Notes are attached to the preceding error, and
 * messages wrapped by `--pretty` (unindented continuation lines) are re-joined;
 * the indented source excerpt and caret lines that `--pretty` adds are skipped.
 */
export function parseMypy(text: string): LocatedDiagnostic[] {
  const result: LocatedDiagnostic[] = [];
  let last: LocatedDiagnostic | undefined;
  let open: { diag: LocatedDiagnostic; note: boolean } | undefined;

  const finish = () => {
    if (open && !open.note) {
      const split = splitRule(open.diag.message);
      open.diag.message = split.message;
      open.diag.rule = split.rule;
    }
    open = undefined;
  };

  for (const line of text.split(/\r?\n/)) {
    const m = line.match(MYPY_LINE);
    if (!m) {
      const continuation = open && line.trim() && !/^\s/.test(line) && !MYPY_SUMMARY.test(line);
      if (continuation) {
        open!.diag.message += " " + line.trim();
      } else {
        finish();
      }
      continue;
    }
    finish();
    const [, file, ln, col, sev, msg] = m;
    if (sev === "note" && last && last.file === file && last.line === Number(ln)) {
      const indent = msg.length - msg.trimStart().length;
      last.message += "\n" + "  ".repeat(1 + Math.floor(indent / 4)) + msg.trim();
      open = { diag: last, note: true };
      continue;
    }
    last = {
      checker: "mypy",
      file,
      line: Number(ln),
      column: col ? Number(col) : undefined,
      severity: normalizeSeverity(sev),
      message: msg,
    };
    open = { diag: last, note: false };
    result.push(last);
  }
  finish();
  return result;
}

/** `mypy -O json` prints one JSON object per line; notes are attached to the preceding error. */
export function parseMypyJsonLines(text: string): LocatedDiagnostic[] | undefined {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0 || !lines.every((l) => l.trimStart().startsWith("{"))) return undefined;
  const result: LocatedDiagnostic[] = [];
  let last: LocatedDiagnostic | undefined;
  for (const line of lines) {
    let d: Record<string, unknown>;
    try {
      d = JSON.parse(line);
    } catch {
      return undefined;
    }
    if (!d || typeof d !== "object" || typeof d.message !== "string") return undefined;
    const file = typeof d.file === "string" ? d.file : undefined;
    const ln = Number.isInteger(d.line) ? (d.line as number) : undefined;
    if (d.severity === "note" && last && last.file === file && last.line === ln) {
      for (const note of d.message.split("\n")) {
        const indent = note.length - note.trimStart().length;
        last.message += "\n" + "  ".repeat(1 + Math.floor(indent / 4)) + note.trim();
      }
      continue;
    }
    last = {
      checker: "mypy",
      file,
      line: ln,
      column: Number.isInteger(d.column) ? (d.column as number) + 1 : undefined,
      severity: normalizeSeverity(typeof d.severity === "string" ? d.severity : "error"),
      message: d.message,
      rule: typeof d.code === "string" ? d.code : undefined,
    };
    if (typeof d.hint === "string" && d.hint) last.message += "\n  " + d.hint;
    result.push(last);
  }
  return result;
}

/**
 * Detects the format and parses it. Returns `undefined` when the input is not
 * checker output we recognise, and an empty array for a clean report.
 */
export function parseAny(text: string): LocatedDiagnostic[] | undefined {
  const json = parsePyrightJson(text);
  if (json) return json;
  const mypyJson = parseMypyJsonLines(text);
  if (mypyJson) return mypyJson;
  const lines = text.split(/\r?\n/);
  if (lines.some((l) => PYRIGHT_LINE.test(l))) return parsePyrightText(text);
  if (lines.some((l) => /^\d+ errors?, \d+ warnings?, \d+ informations?\s*$/.test(l.trim()))) return [];
  const mypy = parseMypy(text);
  if (mypy.length) return mypy;
  if (/^Success: no issues found/m.test(text)) return [];
  return undefined;
}
