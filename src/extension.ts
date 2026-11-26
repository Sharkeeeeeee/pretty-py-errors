import * as vscode from "vscode";
import { toMarkdown, type DiagnosticInput } from "./core/format";
import { resolveLocale } from "./core/i18n";
import { checkerFromSource } from "./core/rules";

const SELECTOR: vscode.DocumentSelector = [
  { language: "python" },
  { language: "jupyter" },
  { notebookType: "jupyter-notebook", language: "python" },
];

/** Longer messages are shown by VS Code as-is; formatting them would only slow the hover down. */
const MAX_MESSAGE_LENGTH = 20_000;
/** Upper bound on diagnostics formatted for a single hover. */
const MAX_DIAGNOSTICS_PER_HOVER = 10;

function severityOf(s: vscode.DiagnosticSeverity): DiagnosticInput["severity"] {
  switch (s) {
    case vscode.DiagnosticSeverity.Warning:
      return "warning";
    case vscode.DiagnosticSeverity.Information:
      return "information";
    case vscode.DiagnosticSeverity.Hint:
      return "hint";
    default:
      return "error";
  }
}

function ruleOf(code: vscode.Diagnostic["code"]): string | undefined {
  if (code === undefined) return undefined;
  if (typeof code === "object") return String(code.value);
  return String(code);
}

export function activate(context: vscode.ExtensionContext): void {
  const provider: vscode.HoverProvider = {
    provideHover(document, position) {
      const config = vscode.workspace.getConfiguration("prettyPyErrors");
      if (!config.get<boolean>("enable", true)) return undefined;

      const locale = resolveLocale(config.get<string>("language", "auto"), vscode.env.language);
      const contents: vscode.MarkdownString[] = [];

      for (const diag of vscode.languages.getDiagnostics(document.uri)) {
        if (!diag.range.contains(position)) continue;
        const checker = checkerFromSource(diag.source);
        if (!checker || diag.message.length > MAX_MESSAGE_LENGTH) continue;
        if (contents.length >= MAX_DIAGNOSTICS_PER_HOVER) break;

        const md = new vscode.MarkdownString(
          toMarkdown(
            { message: diag.message, checker, rule: ruleOf(diag.code), severity: severityOf(diag.severity) },
            {
              locale,
              showHint: config.get<boolean>("showHints", true),
              inlineLimit: config.get<number>("inlineTypeLimit", 40),
              width: config.get<number>("typeWidth", 60),
            },
          ),
        );
        // No raw HTML and no command links: diagnostic text comes from the user's code.
        md.supportHtml = false;
        md.isTrusted = false;
        contents.push(md);
      }

      return contents.length ? new vscode.Hover(contents) : undefined;
    },
  };

  context.subscriptions.push(vscode.languages.registerHoverProvider(SELECTOR, provider));
}

export function deactivate(): void {}
