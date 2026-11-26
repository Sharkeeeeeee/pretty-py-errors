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
