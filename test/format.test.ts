import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseMessage, parseLine } from "../src/core/parse";
import { prettyType } from "../src/core/prettyType";
import { translateMessage, resolveLocale } from "../src/core/i18n";
import { toMarkdown, toAnsi, splitRule } from "../src/core/format";
import { parseAny, parseMypy, parsePyrightJson, parsePyrightText } from "../src/core/inputs";
import { ruleDocsUrl } from "../src/core/rules";

const fixtures = join(__dirname, "..", "..", "test", "fixtures");
const read = (name: string) => readFileSync(join(fixtures, name), "utf8");

test("parseLine splits quoted code", () => {
  assert.deepEqual(parseLine('"a" is not assignable to "int"'), [
    { kind: "code", text: "a" },
    { kind: "text", text: " is not assignable to " },
    { kind: "code", text: "int" },
  ]);
});

test("parseMessage keeps pyright nesting depth", () => {
  const lines = parseMessage('Top "A"\n  Middle "B"\n    Deep "C"');
  assert.deepEqual(lines.map((l) => l.depth), [0, 1, 2]);
});

test("prettyType leaves short types alone", () => {
  assert.equal(prettyType("dict[str, int]"), "dict[str, int]");
});

test("prettyType breaks long nested types", () => {
  const out = prettyType("dict[str, list[tuple[Literal[1], Literal[2]]]] | dict[str, list[tuple[int, str]]] | None", 40);
  assert.ok(out.includes("\n"), out);
  for (const line of out.split("\n")) assert.ok(line.length <= 48, `too long: ${line}`);
  // Round-trips back to the same type once whitespace and trailing commas are removed.
  const squash = (s: string) => s.replace(/,\s*([\])])/g, "$1").replace(/\s+/g, "");
  assert.equal(squash(out), squash("dict[str, list[tuple[Literal[1], Literal[2]]]] | dict[str, list[tuple[int, str]]] | None"));
});

test("prettyType survives unbalanced input", () => {
  const weird = "list[" + "x".repeat(80);
  assert.equal(prettyType(weird), weird);
});

test("zh-TW translation of a nested pyright message", () => {
  const msg = 'Argument of type "Literal[\'x\']" cannot be assigned to parameter "m" of type "Mode" in function "op"\n  Type "Literal[\'x\']" is not assignable to type "Mode"';
  const out = translateMessage(msg, "zh-TW");
  assert.equal(
    out,
    '型別為 "Literal[\'x\']" 的引數，無法指派給函式 "op" 的參數 "m"（型別 "Mode"）\n  型別 "Literal[\'x\']" 無法指派給型別 "Mode"',
  );
});

test("unknown lines are left untouched", () => {
  assert.equal(translateMessage("Something brand new", "zh-TW"), "Something brand new");
});

test("resolveLocale", () => {
  assert.equal(resolveLocale("auto", "zh-tw"), "zh-TW");
  assert.equal(resolveLocale("auto", "zh-Hant-TW"), "zh-TW");
  assert.equal(resolveLocale("auto", "en-US"), "en");
  assert.equal(resolveLocale("zh-TW", "en"), "zh-TW");
});

test("splitRule handles both checkers", () => {
  assert.deepEqual(splitRule('Name "x" is not defined  [name-defined]'), { message: 'Name "x" is not defined', rule: "name-defined" });
  assert.deepEqual(splitRule('"x" is not defined (reportUndefinedVariable)'), { message: '"x" is not defined', rule: "reportUndefinedVariable" });
});

test("docs links", () => {
  assert.equal(ruleDocsUrl("reportArgumentType", "pyright"), "https://microsoft.github.io/pyright/#/configuration?id=reportArgumentType");
  assert.equal(ruleDocsUrl("arg-type", "mypy"), "https://mypy.readthedocs.io/en/stable/error_code_list.html#code-arg-type");
});

test("markdown puts long types in python code blocks", () => {
  const md = toMarkdown({
    checker: "pyright",
    rule: "reportArgumentType",
    message: 'Argument of type "dict[str, list[tuple[Literal[1], Literal[2]]]]" cannot be assigned to parameter "x" of type "dict[str, list[tuple[int, str]]]" in function "f"\n  "Literal[2]" is not assignable to "str"',
  });
  assert.match(md, /\*\*Argument type mismatch\*\*/);
  assert.match(md, /```python\n/);
  assert.match(md, /└─ `Literal\[2\]` is not assignable to `str`/);
  assert.match(md, /configuration\?id=reportArgumentType/);
});

test("markdown escapes text but not code", () => {
  const md = toMarkdown({ checker: "pyright", message: 'Operator "*" not supported for "None"' });
  assert.match(md, /Operator `\*` not supported for `None`/);
});

test("pyright JSON fixture parses", () => {
  const diags = parsePyrightJson(read("pyright.json"))!;
  assert.equal(diags.length, 10);
  assert.equal(diags[0].rule, "reportArgumentType");
  assert.equal(diags[0].line, 11);
});

test("pyright text fixture parses with nested lines", () => {
  const diags = parsePyrightText(read("pyright.txt"));
  assert.equal(diags.length, 10);
  const proto = diags.find((d) => d.message.includes("protocol"))!;
  assert.equal(parseMessage(splitRule(proto.message).message).length, 6);
  assert.match(proto.message, /\(reportAssignmentType\)$/);
});

test("mypy fixture parses and attaches notes", () => {
  const diags = parseMypy(read("mypy.txt"));
  assert.equal(diags.length, 11);
  const proto = diags.find((d) => d.message.includes("Bad"))!;
  assert.equal(proto.rule, "assignment");
  assert.match(proto.message, /Following member/);
});

test("parseAny detects formats", () => {
  assert.equal(parseAny(read("pyright.json"))[0].checker, "pyright");
  assert.equal(parseAny(read("pyright.txt"))[0].checker, "pyright");
  assert.equal(parseAny(read("mypy.txt"))[0].checker, "mypy");
});

test("every fixture renders without throwing, in both languages", () => {
  const all = [...parseAny(read("pyright.json")), ...parseAny(read("mypy.txt"))];
  for (const d of all) {
    for (const locale of ["en", "zh-TW"] as const) {
      assert.ok(toMarkdown(d, { locale }).length > 0);
      const plain = toAnsi(d, { locale, color: false });
      assert.ok(!plain.includes("\u001b["), "no ANSI codes when color is off");
    }
  }
});

test("zh-TW covers every fixture headline", () => {
  const all = [...parseAny(read("pyright.json")), ...parseAny(read("mypy.txt"))];
  for (const d of all) {
    const first = splitRule(d.message).message.split("\n")[0];
    assert.notEqual(translateMessage(first, "zh-TW"), first, `untranslated: ${first}`);
  }
});
