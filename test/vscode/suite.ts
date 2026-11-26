/**
 * Runs inside VS Code. Pylance is not installed in the test instance, so the
 * test publishes Pylance- and mypy-shaped diagnostics itself and checks the
 * hover that the extension contributes for them.
 */
import * as assert from "node:assert/strict";
import { join } from "node:path";
import * as vscode from "vscode";

const EXTENSION_ID = "Sharkeeeeeee.pretty-py-errors";

async function hoverText(uri: vscode.Uri, position: vscode.Position): Promise<string> {
  const hovers = await vscode.commands.executeCommand<vscode.Hover[]>("vscode.executeHoverProvider", uri, position);
  return hovers
    .flatMap((h) => h.contents)
    .map((c) => (typeof c === "string" ? c : "value" in c ? c.value : ""))
    .join("\n---\n");
}

async function waitFor<T>(fn: () => Promise<T | undefined>, timeoutMs = 10_000): Promise<T> {
  const end = Date.now() + timeoutMs;
  for (;;) {
    const value = await fn();
    if (value !== undefined) return value;
    if (Date.now() > end) throw new Error("timed out");
    await new Promise((r) => setTimeout(r, 200));
  }
}

export async function run(): Promise<void> {
  const ext = vscode.extensions.getExtension(EXTENSION_ID);
  assert.ok(ext, `extension ${EXTENSION_ID} is not installed`);

  const file = join(__dirname, "..", "..", "..", "examples", "sample.py");
  const doc = await vscode.workspace.openTextDocument(file);
  await vscode.window.showTextDocument(doc);
  assert.equal(doc.languageId, "python");
  await waitFor(async () => (ext.isActive ? true : undefined));

  const collection = vscode.languages.createDiagnosticCollection("test");
  const range = new vscode.Range(10, 6, 10, 40);
  const pylance = new vscode.Diagnostic(
    range,
    'Argument of type "dict[str, list[tuple[Literal[1], Literal[2]]]]" cannot be assigned to parameter "x" of type "dict[str, list[tuple[int, str]]]" in function "f"\n  "Literal[2]" is not assignable to "str"',
    vscode.DiagnosticSeverity.Error,
  );
  pylance.source = "Pylance";
  pylance.code = { value: "reportArgumentType", target: vscode.Uri.parse("https://example.com") };
  const ruff = new vscode.Diagnostic(range, "Unused import", vscode.DiagnosticSeverity.Warning);
  ruff.source = "Ruff";
  collection.set(doc.uri, [pylance, ruff]);

  const pos = new vscode.Position(10, 10);
  const en = await waitFor(async () => {
    const text = await hoverText(doc.uri, pos);
    return text.includes("Argument type mismatch") ? text : undefined;
  });
  assert.match(en, /```python\n/, "long types are rendered as python code blocks");
  assert.match(en, /configuration\?id=reportArgumentType/, "links to the rule documentation");
  assert.equal((en.match(/🔴|🟡|🔵/g) ?? []).length, 1, "diagnostics from other sources are ignored");

  const config = vscode.workspace.getConfiguration("prettyPyErrors");
  for (const [lang, title] of [["zh-TW", "引數型別不符"], ["zh-CN", "实参类型不匹配"], ["ja", "引数の型が一致しません"], ["ko", "인수 형식 불일치"]]) {
    await config.update("language", lang, vscode.ConfigurationTarget.Global);
    const text = await hoverText(doc.uri, pos);
    assert.ok(text.includes(title), `[${lang}] expected "${title}" in hover:\n${text}`);
  }
  await config.update("language", undefined, vscode.ConfigurationTarget.Global);

  const mypy = new vscode.Diagnostic(range, 'Name "undefined_name" is not defined', vscode.DiagnosticSeverity.Error);
  mypy.source = "Mypy";
  mypy.code = "name-defined";
  collection.set(doc.uri, [mypy]);
  const mypyText = await hoverText(doc.uri, pos);
  assert.match(mypyText, /Undefined name/);
  assert.match(mypyText, /code-name-defined/);

  await config.update("enable", false, vscode.ConfigurationTarget.Global);
  assert.doesNotMatch(await hoverText(doc.uri, pos), /Undefined name/, "can be disabled");
  await config.update("enable", undefined, vscode.ConfigurationTarget.Global);

  collection.dispose();
  console.log("VS Code integration test passed");
}
