import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..", "..");
const cli = join(root, "out", "src", "cli", "index.js");
const fixture = (name: string) => readFileSync(join(root, "test", "fixtures", name), "utf8");

interface Result {
  code: number | null;
  stdout: string;
  stderr: string;
}

/** Runs the CLI, feeding stdin slowly in chunks the way a real `pyright | pretty-py-errors` pipe does. */
function run(args: string[], input?: string, env: Record<string, string> = {}): Promise<Result> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cli, ...args], {
      env: { ...process.env, LANG: "en_US.UTF-8", LC_ALL: "", ...env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    if (input === undefined) return child.stdin.end();
    const chunks = input.match(/[\s\S]{1,200}/g) ?? [""];
    let i = 0;
    const next = () => {
      if (i < chunks.length) {
        child.stdin.write(chunks[i++]);
        setTimeout(next, 5);
      } else child.stdin.end();
    };
    next();
  });
}

test("reads a slow stdin pipe (pyright JSON) and exits 1 on errors", async () => {
  const r = await run(["--no-color"], fixture("pyright.json"));
  assert.equal(r.stderr, "");
  assert.equal(r.code, 1);
  assert.match(r.stdout, /Argument type mismatch/);
  assert.match(r.stdout, /10 error\(s\)/);
});

test("reads pyright text, mypy text and mypy JSON lines", async () => {
  for (const name of ["pyright.txt", "mypy.txt", "mypy.jsonl"]) {
    const r = await run(["--no-color"], fixture(name));
    assert.equal(r.code, 1, name);
    assert.match(r.stdout, /error\(s\)/, name);
  }
});

test("clean reports print a success line and exit 0", async () => {
  const clean = JSON.stringify({ version: "1", generalDiagnostics: [], summary: { errorCount: 0 } });
  for (const input of [clean, "0 errors, 0 warnings, 0 informations \n", "Success: no issues found in 1 source file\n"]) {
    const r = await run(["--no-color"], input);
    assert.equal(r.code, 0);
    assert.equal(r.stdout, "✔ No problems found\n");
  }
});

test("unrecognised input is passed through", async () => {
  const r = await run(["--no-color"], "hello world\n");
  assert.equal(r.code, 0);
  assert.equal(r.stdout, "hello world\n");
});

test("language comes from --lang or $LANG", async () => {
  const fromFlag = await run(["--no-color", "--lang", "ko"], fixture("pyright.json"));
  assert.match(fromFlag.stdout, /인수 형식 불일치/);
  const fromEnv = await run(["--no-color"], fixture("pyright.json"), { LANG: "ja_JP.UTF-8" });
  assert.match(fromEnv.stdout, /引数の型が一致しません/);
});

test("bad arguments fail with exit code 2 and a clear message", async () => {
  assert.equal((await run(["--lang"])).code, 2);
  assert.equal((await run(["--lang", "fr"])).code, 2);
  assert.equal((await run(["--width", "abc"])).code, 2);
  const missing = await run(["does-not-exist.json"]);
  assert.equal(missing.code, 2);
  assert.match(missing.stderr, /cannot read does-not-exist\.json/);
  assert.doesNotMatch(missing.stderr, /at readFileSync/);
});

test("reads a report from a file argument", async () => {
  const r = await run(["--no-color", join(root, "test", "fixtures", "demo.json")]);
  assert.equal(r.code, 1);
  assert.match(r.stdout, /is invariant/);
});
