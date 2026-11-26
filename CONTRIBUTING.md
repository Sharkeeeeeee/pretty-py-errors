# Contributing to pretty-py-errors

Thank you for your interest in contributing. This guide explains how to set up the project and what we expect from pull requests.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding a Translation Pattern](#adding-a-translation-pattern)
- [Adding a Rule Title or Hint](#adding-a-rule-title-or-hint)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold it.

## Ways to Contribute

- Report a message that is formatted badly. Please include the **raw** checker output.
- Add or improve translations in `src/core/i18n.ts`. Native speakers reviewing the `zh-CN`, `ja` and `ko` wording are especially welcome.
- Add titles and fix hints for more rules in `src/core/rules.ts`.
- Add support for another checker or output format in `src/core/inputs.ts`.

## Development Setup

Requirements: Node.js 18+ and VS Code.

```bash
git clone https://github.com/Sharkeeeeeee/pretty-py-errors.git
cd pretty-py-errors
npm install
npm test          # build and run unit and CLI tests
xvfb-run -a npm run test:vscode   # run the extension in a real VS Code (drop xvfb-run on macOS/Windows)
npm run demo      # print the CLI output for the sample fixture
npm run docs      # regenerate the README screenshots
```

To try the extension, open the folder in VS Code and press <kbd>F5</kbd> (**Run Extension**). Open `examples/demo.py` in the new window and hover over an error.

## Project Structure

```
src/
  core/        Checker-agnostic formatting logic (no VS Code dependency)
  cli/         Command-line entry point
  extension.ts VS Code hover provider
test/
  fixtures/    Real Pyright and mypy output used by the tests and screenshots
scripts/       Screenshot generation
examples/      Python files that produce the fixtures
```

## Adding a Translation Pattern

1. Capture the real message from Pyright or mypy and add it to a fixture if it is not covered yet.
2. Add a `[re("..."), { "zh-TW": ..., "zh-CN": ..., ja: ..., ko: ... }]` entry to `PATTERNS` in `src/core/i18n.ts`. Use `QQ` for each quoted part and keep the quotes in every translation, so the value is still rendered as code.
3. Put more specific patterns before more general ones.
4. Add a test in `test/format.test.ts`.

## Adding a Rule Title or Hint

Add an entry to `RULES` in `src/core/rules.ts`, keyed by the Pyright rule name (for example `reportArgumentType`) or the mypy error code (for example `arg-type`). Every entry needs a value for each locale: `en`, `zh-TW`, `zh-CN`, `ja` and `ko`. Shared titles and hints live in the `T` and `H` tables.

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Commit messages are written in English.

```
<type>(<optional scope>): <summary in imperative mood>

<optional body explaining what and why>
```

| Type | Use for |
| --- | --- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Other maintenance |

Examples:

```
feat(i18n): add zh-TW translation for reportCallIssue messages
fix(cli): keep indentation of mypy notes
docs: add Neovim section to README
```

## Pull Request Process

1. Fork the repository and create a branch from `main` (for example `feat/ja-translations`).
2. Make your change and add tests.
3. Run `npm test` and make sure it passes.
4. Update `CHANGELOG.md` under **Unreleased**.
5. Open a pull request and fill in the template.
