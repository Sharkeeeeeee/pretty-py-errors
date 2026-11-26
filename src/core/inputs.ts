/** Parsers for checker output in the terminal: `pyright --outputjson`, plain pyright, and mypy. */
import type { DiagnosticInput } from "./format";

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
  return diags.map((raw) => {
    const d = raw as {
      file?: string;
      severity?: string;
      message: string;
      rule?: string;
      range?: { start?: { line: number; character: number } };
    };
    return {
      checker: "pyright" as const,
      message: d.message,
      rule: d.rule,
      severity: normalizeSeverity(d.severity ?? "error"),
      file: d.file,
      line: d.range?.start ? d.range.start.line + 1 : undefined,
      column: d.range?.start ? d.range.start.character + 1 : undefined,
    };
  });
}

const PYRIGHT_LINE = /^\s*(.+?):(\d+):(\d+) - (error|warning|information): (.*)$/;

export function parsePyrightText(text: string): LocatedDiagnostic[] {
  const result: LocatedDiagnostic[] = [];
  let current: LocatedDiagnostic | undefined;
  let baseIndent = 0;
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
      baseIndent = line.length - line.trimStart().length + 2;
      result.push(current);
    } else if (current && line.trim() && line.length - line.trimStart().length >= baseIndent) {
      current.message += "\n" + line.slice(baseIndent);
    } else {
      current = undefined;
    }
  }
  return result;
}

const MYPY_LINE = /^(.+?):(\d+):(?:(\d+):)? (error|warning|note): (.*)$/;

/** mypy prints notes as separate lines; they are attached to the preceding error. */
export function parseMypy(text: string): LocatedDiagnostic[] {
  const result: LocatedDiagnostic[] = [];
  let last: LocatedDiagnostic | undefined;
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(MYPY_LINE);
    if (!m) continue;
    const [, file, ln, col, sev, msg] = m;
    if (sev === "note" && last && last.file === file && last.line === Number(ln)) {
      const indent = msg.length - msg.trimStart().length;
      last.message += "\n" + "  ".repeat(1 + Math.floor(indent / 4)) + msg.trim();
      continue;
    }
    const code = msg.match(/^(.*?)\s+\[([a-z][a-z-]*)\]$/);
    last = {
      checker: "mypy",
      file,
      line: Number(ln),
      column: col ? Number(col) : undefined,
      severity: normalizeSeverity(sev),
      message: code ? code[1] : msg,
      rule: code ? code[2] : undefined,
    };
    result.push(last);
  }
  return result;
}

export function parseAny(text: string): LocatedDiagnostic[] {
  const json = parsePyrightJson(text);
  if (json) return json;
  if (PYRIGHT_LINE.test(text.split(/\r?\n/).find((l) => PYRIGHT_LINE.test(l)) ?? "")) {
    return parsePyrightText(text);
  }
  return parseMypy(text);
}
