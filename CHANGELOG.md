# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Simplified Chinese (`zh-CN`), Japanese (`ja`) and Korean (`ko`) translations for all message patterns, rule titles and fix hints.
- Automatic locale detection for `zh-CN`, `ja` and `ko` from the VS Code display language and `$LANG`.
- Localized READMEs in Simplified Chinese, Japanese and Korean.

### Fixed

- The CLI no longer prints an empty line when a message starts with a long type.

### Security

- Fixed quadratic regular-expression backtracking (ReDoS) when stripping rule codes from messages with long whitespace runs.
- Deeply nested or very long types are no longer parsed recursively, preventing a stack overflow.
- Backticks inside types can no longer break out of Markdown code spans or code blocks in the hover.
- Raw HTML is disabled in hover Markdown.
- Terminal control characters (ANSI escape sequences) from checker output are stripped before printing.
- CI runs with read-only `contents` permission and does not persist checkout credentials.
- Rule names that exist on `Object.prototype` (for example `[constructor]` in mypy output) no longer crash the formatter.
- Malformed entries in Pyright JSON reports are skipped instead of crashing the CLI.
- The VS Code hover skips messages over 20,000 characters and formats at most 10 diagnostics at a time.
- GitHub Actions are pinned to commit SHAs, `vsce` is pinned to a major version, and Dependabot keeps both up to date.

## [0.1.0] - 2026-11-26

### Added

- VS Code extension that shows prettified Pyright, Pylance, basedpyright and mypy diagnostics on hover, including in Jupyter notebooks.
- `pretty-py-errors` CLI that reads Pyright JSON, Pyright text and mypy text output.
- Long-type extraction and wrapping at brackets and `|` unions.
- Tree rendering of nested Pyright explanations and mypy notes.
- Rule titles, fix hints and links to the Pyright and mypy rule documentation.
- Traditional Chinese (`zh-TW`) translations for more than 70 message patterns.

[Unreleased]: https://github.com/Sharkeeeeeee/pretty-py-errors/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Sharkeeeeeee/pretty-py-errors/releases/tag/v0.1.0
