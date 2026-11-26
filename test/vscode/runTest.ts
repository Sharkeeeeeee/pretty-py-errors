/**
 * Launches a real VS Code instance with the extension loaded and runs
 * `suite.ts` inside it. Used by `npm run test:vscode` (needs a display: use
 * `xvfb-run -a npm run test:vscode` on headless Linux).
 */
import { join } from "node:path";
import { runTests } from "@vscode/test-electron";

async function main(): Promise<void> {
  const root = join(__dirname, "..", "..", "..");
  await runTests({
    version: process.env.VSCODE_VERSION ?? "stable",
    extensionDevelopmentPath: root,
    extensionTestsPath: join(__dirname, "suite.js"),
    launchArgs: [join(root, "examples"), "--disable-extensions", "--disable-workspace-trust"],
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
