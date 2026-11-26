#!/usr/bin/env node
// Renders ANSI-colored terminal output (stdin) as a terminal-window SVG (stdout).
// Used to generate the README screenshots: `node scripts/render-docs.mjs`.
import { readFileSync } from "node:fs";

const title = process.argv[2] ?? "Terminal";
const input = readFileSync(0, "utf8").replace(/\r/g, "").replace(/\n+$/, "");

const PALETTE = {
  30: "#545862", 31: "#f7768e", 32: "#9ece6a", 33: "#e0af68",
  34: "#7aa2f7", 35: "#bb9af7", 36: "#7dcfff", 37: "#c0caf5", 90: "#737aa2",
};
const FG = "#c0caf5";
const BG = "#1a1b26";
const CHAR_W = 8.4;
const LINE_H = 20;
const PAD_X = 20;
const TOP = 48;

const isWide = (cp) =>
  (cp >= 0x1100 && cp <= 0x115f) || (cp >= 0x2e80 && cp <= 0xa4cf) || (cp >= 0xac00 && cp <= 0xd7a3) ||
  (cp >= 0xf900 && cp <= 0xfaff) || (cp >= 0xfe30 && cp <= 0xfe4f) || (cp >= 0xff00 && cp <= 0xff60) ||
  (cp >= 0xffe0 && cp <= 0xffe6) || (cp >= 0x1f300 && cp <= 0x1faff);
const width = (s) => [...s].reduce((n, ch) => n + (isWide(ch.codePointAt(0)) ? 2 : 1), 0);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let maxCols = 0;
const rows = input.split("\n").map((line) => {
  const spans = [];
  let state = { fg: FG, bold: false, dim: false };
  let col = 0;
  for (const part of line.split(/(\u001b\[[0-9;]*m)/)) {
    const m = part.match(/^\u001b\[([0-9;]*)m$/);
    if (m) {
      for (const code of (m[1] || "0").split(";").map(Number)) {
        if (code === 0) state = { fg: FG, bold: false, dim: false };
        else if (code === 1) state = { ...state, bold: true };
        else if (code === 2) state = { ...state, dim: true };
        else if (PALETTE[code]) state = { ...state, fg: PALETTE[code] };
      }
      continue;
    }
    if (!part) continue;
    // Position each word run by column; whitespace only moves the cursor.
    for (const piece of part.split(/(\s+)/)) {
      if (piece && !/^\s+$/.test(piece)) spans.push({ text: piece, col, ...state });
      col += width(piece);
    }
  }
  maxCols = Math.max(maxCols, col);
  return spans;
});

const W = Math.ceil(PAD_X * 2 + maxCols * CHAR_W);
const H = TOP + rows.length * LINE_H + 20;
const out = [];
out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
out.push(`<rect width="${W}" height="${H}" rx="10" fill="${BG}"/>`);
out.push(`<circle cx="22" cy="20" r="6" fill="#ff5f57"/><circle cx="42" cy="20" r="6" fill="#febc2e"/><circle cx="62" cy="20" r="6" fill="#28c840"/>`);
out.push(`<text x="${W / 2}" y="24" fill="#737aa2" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" text-anchor="middle">${esc(title)}</text>`);
out.push(`<g font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,'Noto Sans Mono CJK TC','Microsoft JhengHei',monospace" font-size="14" xml:space="preserve">`);
rows.forEach((spans, i) => {
  const y = TOP + i * LINE_H + 14;
  for (const s of spans) {
    const attrs = [`x="${(PAD_X + s.col * CHAR_W).toFixed(1)}"`, `y="${y}"`, `fill="${s.fg}"`];
    if (s.bold) attrs.push('font-weight="bold"');
    if (s.dim) attrs.push('opacity="0.65"');
    out.push(`<text ${attrs.join(" ")} textLength="${(width(s.text) * CHAR_W).toFixed(1)}" lengthAdjust="spacingAndGlyphs">${esc(s.text)}</text>`);
  }
});
out.push("</g></svg>");
process.stdout.write(out.join("\n") + "\n");
