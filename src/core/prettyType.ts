/**
 * Pretty-prints long Python type expressions such as
 *   dict[str, list[tuple[Literal[1], Literal[2]]]]
 * across several lines, breaking at top-level commas inside brackets and at
 * top-level `|` unions, like a code formatter would.
 */

type Node =
  | { kind: "text"; text: string }
  | { kind: "group"; open: string; close: string; items: Node[][] };

const PAIRS: Record<string, string> = { "[": "]", "(": ")", "{": "}" };
const CLOSERS = new Set(Object.values(PAIRS));

/** Parses a type string into nested bracket groups. Never throws: unbalanced input stays as text. */
function parse(src: string): Node[] | undefined {
  let i = 0;

  function parseSeq(close?: string): Node[][] | undefined {
    const items: Node[][] = [[]];
    let buf = "";
    let quote: string | undefined;
    const flush = () => {
      if (buf) items[items.length - 1].push({ kind: "text", text: buf });
      buf = "";
    };
    while (i < src.length) {
      const ch = src[i];
      if (quote) {
        buf += ch;
        if (ch === quote) quote = undefined;
        i++;
        continue;
      }
      if (ch === "'" || ch === '"') {
        quote = ch;
        buf += ch;
        i++;
        continue;
      }
      if (ch in PAIRS) {
        flush();
        i++;
        const inner = parseSeq(PAIRS[ch]);
        if (!inner) return undefined;
        items[items.length - 1].push({ kind: "group", open: ch, close: PAIRS[ch], items: inner });
        continue;
      }
      if (CLOSERS.has(ch)) {
        if (ch !== close) return undefined;
        flush();
        i++;
        return items;
      }
      if (ch === "," && close) {
        flush();
        items.push([]);
        i++;
        while (src[i] === " ") i++;
        continue;
      }
      buf += ch;
      i++;
    }
    if (close) return undefined;
    flush();
    return items;
  }

  const seq = parseSeq();
  return seq ? seq[0] : undefined;
}

function flat(nodes: Node[]): string {
  return nodes
    .map((n) =>
      n.kind === "text" ? n.text : n.open + n.items.map(flat).join(", ") + n.close,
    )
    .join("");
}

/** Splits a sequence of nodes at top-level ` | ` separators. */
function splitUnion(nodes: Node[]): Node[][] {
  const parts: Node[][] = [[]];
  for (const n of nodes) {
    if (n.kind === "text" && n.text.includes(" | ")) {
      const pieces = n.text.split(" | ");
      pieces.forEach((piece, idx) => {
        if (idx > 0) parts.push([]);
        if (piece) parts[parts.length - 1].push({ kind: "text", text: piece });
      });
    } else {
      parts[parts.length - 1].push(n);
    }
  }
  return parts.filter((p) => p.length > 0);
}

function format(nodes: Node[], indent: string, width: number): string {
  const one = flat(nodes);
  if (indent.length + one.length <= width) return one;

  const union = splitUnion(nodes);
  if (union.length > 1) {
    return union
      .map((part, idx) => (idx === 0 ? "" : indent + "| ") + format(part, indent + "  ", width))
      .join("\n");
  }

  // Break the widest bracket group; keep the text around it on the same line.
  return nodes
    .map((n) => {
      if (n.kind === "text") return n.text;
      const inline = n.open + n.items.map(flat).join(", ") + n.close;
      if (n.items.length === 1 && n.items[0].length === 0) return inline;
      if (indent.length + inline.length <= width) return inline;
      const inner = indent + "    ";
      const body = n.items.map((item) => inner + format(item, inner, width)).join(",\n");
      return `${n.open}\n${body},\n${indent}${n.close}`;
    })
    .join("");
}

export function prettyType(type: string, width = 60): string {
  const trimmed = type.trim();
  if (trimmed.length <= width) return trimmed;
  const nodes = parse(trimmed);
  if (!nodes) return trimmed;
  return format(nodes, "", width);
}
