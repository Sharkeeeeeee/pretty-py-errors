import { looksLikeType, parseMessage, type MessageLine, type Segment } from "./parse";
import { prettyType } from "./prettyType";
import { translateMessage, type Locale } from "./i18n";
import { ruleDocsUrl, ruleHint, ruleTitle, type Checker } from "./rules";

export interface DiagnosticInput {
  message: string;
  checker: Checker;
  rule?: string;
  severity?: "error" | "warning" | "information" | "hint";
}

export interface FormatOptions {
  locale?: Locale;
  /** Types longer than this are put on their own lines. */
  inlineLimit?: number;
  /** Target width for multi-line types. */
  width?: number;
  showHint?: boolean;
  showOriginal?: boolean;
}

export interface FormattedDiagnostic {
  title: string;
  rule?: string;
  docsUrl?: string;
  hint?: string;
  lines: MessageLine[];
  original: string;
}

/** Strips a trailing mypy `  [code]` or Pyright ` (rule)` that may still be in the text. */
export function splitRule(message: string): { message: string; rule?: string } {
  const mypy = message.match(/^([\s\S]*?)\s+\[([a-z][a-z-]*)\]\s*$/);
  if (mypy) return { message: mypy[1], rule: mypy[2] };
  const pyright = message.match(/^([\s\S]*?)\s+\((report[A-Za-z]+)\)\s*$/);
  if (pyright) return { message: pyright[1], rule: pyright[2] };
  return { message };
}

export function analyze(input: DiagnosticInput, options: FormatOptions = {}): FormattedDiagnostic {
  const locale = options.locale ?? "en";
  const split = splitRule(input.message.trimEnd());
  const rule = input.rule ?? split.rule;
  const translated = translateMessage(split.message, locale);
  return {
    title: ruleTitle(rule, locale),
    rule,
    docsUrl: ruleDocsUrl(rule, input.checker),
    hint: options.showHint === false ? undefined : ruleHint(rule, locale, split.message),
    lines: parseMessage(translated),
    original: split.message,
  };
}

/**
 * Types longer than `inlineLimit` go on their own lines. When a whole line is
 * very long, medium-sized types are moved out too so the sentence stays readable.
 */
export function blockLimit(line: MessageLine, inlineLimit: number): number {
  const length = line.segments.reduce((n, s) => n + s.text.length + (s.kind === "code" ? 2 : 0), 0);
  return length > 110 ? Math.min(inlineLimit, 24) : inlineLimit;
}

// ---------------------------------------------------------------- markdown

function inlineCode(text: string): string {
  const ticks = text.includes("`") ? "``" : "`";
  const pad = text.startsWith("`") || text.endsWith("`") ? " " : "";
  return `${ticks}${pad}${text}${pad}${ticks}`;
}

function escapeMarkdown(text: string): string {
  return text.replace(/([\\`*_{}\[\]<>#|~])/g, "\\$1");
}

function renderSegmentsMarkdown(segments: Segment[], inlineLimit: number, width: number): string[] {
  // Returns paragraphs: plain markdown text, or fenced code blocks for long types.
  const out: string[] = [];
  let current = "";
  for (const seg of segments) {
    if (seg.kind === "text") {
      current += escapeMarkdown(seg.text);
    } else if (seg.text.length > inlineLimit && looksLikeType(seg.text)) {
      if (current.trim()) out.push(current.trim());
      current = "";
      out.push("```python\n" + prettyType(seg.text, width) + "\n```");
    } else {
      current += inlineCode(seg.text);
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

const NBSP = " ";

export function toMarkdown(input: DiagnosticInput, options: FormatOptions = {}): string {
  const inlineLimit = options.inlineLimit ?? 40;
  const width = options.width ?? 60;
  const d = analyze(input, options);
  const icon = input.severity === "warning" ? "🟡" : input.severity === "information" || input.severity === "hint" ? "🔵" : "🔴";

  let header = `${icon} **${escapeMarkdown(d.title)}**`;
  if (d.rule) header += d.docsUrl ? ` · [${inlineCode(d.rule)}](${d.docsUrl})` : ` · ${inlineCode(d.rule)}`;
  const parts: string[] = [header];

  d.lines.forEach((line) => {
    const paragraphs = renderSegmentsMarkdown(line.segments, blockLimit(line, inlineLimit), width);
    const prefix = line.depth === 0 ? "" : NBSP.repeat((line.depth - 1) * 4) + "└─" + NBSP;
    paragraphs.forEach((p, idx) => {
      parts.push(idx === 0 && !p.startsWith("```") ? prefix + p : p);
    });
  });

  if (d.hint) parts.push(`💡 ${d.hint}`);
  if (options.showOriginal) parts.push("<details><summary>Original message</summary>\n\n```text\n" + d.original + "\n```\n</details>");
  return parts.join("\n\n");
}

// -------------------------------------------------------------------- ANSI

const ESC = "\u001b[";
const c = {
  reset: ESC + "0m",
  bold: ESC + "1m",
  dim: ESC + "2m",
  red: ESC + "31m",
  green: ESC + "32m",
  yellow: ESC + "33m",
  blue: ESC + "34m",
  magenta: ESC + "35m",
  cyan: ESC + "36m",
  gray: ESC + "90m",
};

const KEYWORDS = new Set(["None", "True", "False", "Literal", "Callable", "TypedDict", "Protocol", "type", "Never", "Any"]);

/** Very small Python type highlighter for the terminal. */
export function highlightType(text: string, color = true): string {
  if (!color) return text;
  return text.replace(
    /('[^']*'|"[^"]*")|(\b\d+\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([\[\](){}|,]|->)/g,
    (m, str, num, ident, punct) => {
      if (str) return c.green + str + c.reset;
      if (num) return c.yellow + num + c.reset;
      if (ident) {
        if (KEYWORDS.has(ident)) return c.magenta + ident + c.reset;
        if (/^[A-Z]/.test(ident)) return c.cyan + ident + c.reset;
        return c.blue + ident + c.reset;
      }
      if (punct) return c.gray + punct + c.reset;
      return m;
    },
  );
}

const isWide = (cp: number) =>
  (cp >= 0x1100 && cp <= 0x115f) || (cp >= 0x2e80 && cp <= 0xa4cf) || (cp >= 0xac00 && cp <= 0xd7a3) ||
  (cp >= 0xf900 && cp <= 0xfaff) || (cp >= 0xfe30 && cp <= 0xfe4f) || (cp >= 0xff00 && cp <= 0xff60) ||
  (cp >= 0xffe0 && cp <= 0xffe6);

/** Display width in terminal columns (CJK characters count as two). */
export function displayWidth(text: string): number {
  let n = 0;
  for (const ch of text) n += isWide(ch.codePointAt(0)!) ? 2 : 1;
  return n;
}

/** Wraps prose to a column width, breaking at spaces or between CJK characters. */
export function wrapText(text: string, max: number): string[] {
  const tokens = text.match(/[\u2e80-\ua4cf\uff00-\uff60]|[^\s\u2e80-\ua4cf\uff00-\uff60]+|\s+/g) ?? [];
  const lines: string[] = [];
  let line = "";
  for (const tok of tokens) {
    if (/^\s+$/.test(tok)) {
      if (line) line += " ";
      continue;
    }
    if (line && displayWidth(line + tok) > max && !/^[，。：；、）！？」]/.test(tok)) {
      lines.push(line.trimEnd());
      line = "";
    }
    line += tok;
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

export interface AnsiOptions extends FormatOptions {
  color?: boolean;
  location?: string;
}

export function toAnsi(input: DiagnosticInput, options: AnsiOptions = {}): string {
  const color = options.color ?? true;
  const paint = (code: string, text: string) => (color ? code + text + c.reset : text);
  const inlineLimit = options.inlineLimit ?? 40;
  const width = options.width ?? 60;
  const d = analyze(input, options);

  const sevColor = input.severity === "warning" ? c.yellow : input.severity === "error" || !input.severity ? c.red : c.blue;
  const sevLabel = input.severity ?? "error";
  const out: string[] = [];
  let header = paint(c.bold + sevColor, `● ${sevLabel}`) + " " + paint(c.bold, d.title);
  if (d.rule) header += " " + paint(c.dim, `[${d.rule}]`);
  if (options.location) header += "  " + paint(c.dim + c.gray, options.location);
  out.push(header);

  for (const line of d.lines) {
    const gutter = "  " + (line.depth === 0 ? "" : "    ".repeat(line.depth - 1) + paint(c.gray, "└─ "));
    const textCol = line.depth === 0 ? 2 : 2 + (line.depth - 1) * 4 + 3;
    const contIndent = " ".repeat(textCol);
    const blockIndent = " ".repeat(textCol + 2);
    let current = "";
    const flush = (first: boolean) => {
      if (current.trim()) out.push((first ? gutter : contIndent) + current.trim());
      current = "";
    };
    let first = true;
    const limit = blockLimit(line, inlineLimit);
    for (const seg of line.segments) {
      if (seg.kind === "text") {
        current += seg.text;
      } else if (seg.text.length > limit && looksLikeType(seg.text)) {
        if (current.trim()) {
          flush(first);
          first = false;
        }
        const block = prettyType(seg.text, width)
          .split("\n")
          .map((l) => blockIndent + paint(c.gray, "│ ") + highlightType(l, color));
        if (first) {
          if (gutter.trim()) out.push(gutter.trimEnd());
          first = false;
        }
        out.push(...block);
      } else {
        current += color ? highlightType(seg.text) : `"${seg.text}"`;
      }
    }
    flush(first);
  }

  if (d.hint) {
    const code = (l: string) => (color ? l.replace(/`([^`]+)`/g, (_, t) => c.reset + c.cyan + t + c.reset + c.dim) : l);
    wrapText(d.hint, 76).forEach((l, i) =>
      out.push((i === 0 ? "  " + paint(c.yellow, "💡 ") : "     ") + paint(c.dim, code(l))),
    );
  }
  if (d.docsUrl) out.push("  " + paint(c.dim, "📖 " + d.docsUrl));
  return out.join("\n");
}
