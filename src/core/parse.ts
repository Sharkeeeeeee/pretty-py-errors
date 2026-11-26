/**
 * Splits a raw Pyright / mypy diagnostic message into indented lines made of
 * plain text and quoted code segments.
 *
 * Pyright nests its explanation with two spaces per level:
 *
 *   Argument of type "A" cannot be assigned to parameter "x" of type "B"
 *     "Literal['1']" is not assignable to "int"
 */

export type Segment =
  | { kind: "text"; text: string }
  | { kind: "code"; text: string };

export interface MessageLine {
  depth: number;
  segments: Segment[];
}

const QUOTED = /"([^"\n]+)"/g;

export function parseLine(line: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of line.matchAll(QUOTED)) {
    const start = match.index ?? 0;
    if (start > last) segments.push({ kind: "text", text: line.slice(last, start) });
    segments.push({ kind: "code", text: match[1] });
    last = start + match[0].length;
  }
  if (last < line.length) segments.push({ kind: "text", text: line.slice(last) });
  return segments;
}

export function parseMessage(message: string): MessageLine[] {
  return message
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const indent = line.length - line.trimStart().length;
      return { depth: Math.floor(indent / 2), segments: parseLine(line.trim()) };
    });
}

/** True when a quoted segment looks like a type or expression rather than a bare name. */
export function looksLikeType(code: string): boolean {
  return /[\[\]()|,:\->'.]/.test(code) || /^[A-Z]/.test(code) || isBuiltinType(code);
}

const BUILTIN_TYPES = new Set([
  "int", "str", "float", "bool", "bytes", "complex", "None", "object",
  "list", "dict", "set", "tuple", "frozenset", "type", "Any", "Never",
]);

function isBuiltinType(code: string): boolean {
  return BUILTIN_TYPES.has(code);
}
