import type { Locale } from "./i18n";

export type Checker = "pyright" | "mypy";

interface RuleInfo {
  title: Record<Locale, string>;
  hint?: Record<Locale, string>;
}

/** Short titles and fix hints for the rules people hit most often. */
const RULES: Record<string, RuleInfo> = {
  // Pyright / Pylance / basedpyright
  reportArgumentType: {
    title: { en: "Argument type mismatch", "zh-TW": "引數型別不符" },
    hint: {
      en: "The value you pass doesn't match the parameter's annotation. Read the indented lines from the bottom up: the deepest one is the actual conflict.",
      "zh-TW": "傳入的值和參數的型別註記不符。從最下面那行往上讀：縮排最深的那行才是真正衝突的地方。",
    },
  },
  reportAssignmentType: {
    title: { en: "Assignment type mismatch", "zh-TW": "賦值型別不符" },
    hint: {
      en: "The value doesn't match the variable's declared type. Fix the value, or widen the annotation (e.g. `int | None`).",
      "zh-TW": "賦予的值和變數宣告的型別不符。修正這個值，或放寬型別註記（例如 `int | None`）。",
    },
  },
  reportReturnType: {
    title: { en: "Return type mismatch", "zh-TW": "回傳型別不符" },
    hint: {
      en: "What the function returns doesn't match its `-> ...` annotation.",
      "zh-TW": "函式實際回傳的值和 `-> ...` 註記的型別不符。",
    },
  },
  reportAttributeAccessIssue: {
    title: { en: "Unknown attribute", "zh-TW": "屬性不存在" },
    hint: {
      en: "Check for a typo, or whether the object could be a different type (often `None`) at this point.",
      "zh-TW": "檢查是否拼錯，或這個物件在這裡可能是別的型別（常見是 `None`）。",
    },
  },
  reportOptionalMemberAccess: {
    title: { en: "Value may be None", "zh-TW": "值可能是 None" },
    hint: {
      en: "Guard it first: `if x is not None:` (or `assert x is not None`).",
      "zh-TW": "先排除 None：`if x is not None:`（或 `assert x is not None`）。",
    },
  },
  reportOptionalOperand: {
    title: { en: "Value may be None", "zh-TW": "值可能是 None" },
    hint: {
      en: "One side of the operator can be `None`. Narrow it with `if x is not None:` first.",
      "zh-TW": "運算子的其中一邊可能是 `None`。先用 `if x is not None:` 縮小型別。",
    },
  },
  reportOptionalSubscript: {
    title: { en: "Value may be None", "zh-TW": "值可能是 None" },
    hint: { en: "Check for `None` before indexing with `[]`.", "zh-TW": "用 `[]` 取值前先檢查是不是 `None`。" },
  },
  reportOptionalIterable: {
    title: { en: "Value may be None", "zh-TW": "值可能是 None" },
    hint: { en: "Check for `None` before looping over it.", "zh-TW": "迭代前先檢查是不是 `None`。" },
  },
  reportOptionalCall: {
    title: { en: "Value may be None", "zh-TW": "值可能是 None" },
    hint: { en: "Check for `None` before calling it.", "zh-TW": "呼叫前先檢查是不是 `None`。" },
  },
  reportCallIssue: {
    title: { en: "Bad call", "zh-TW": "呼叫方式錯誤" },
    hint: {
      en: "The number or names of the arguments don't match the function's signature.",
      "zh-TW": "引數的數量或名稱和函式簽章對不上。",
    },
  },
  reportIndexIssue: { title: { en: "Bad index", "zh-TW": "索引錯誤" } },
  reportMissingImports: {
    title: { en: "Import not found", "zh-TW": "找不到匯入的模組" },
    hint: {
      en: "Install the package in the interpreter VS Code is using, or select the right interpreter (Python: Select Interpreter).",
      "zh-TW": "在 VS Code 目前使用的直譯器裡安裝這個套件，或切換到正確的直譯器（Python: Select Interpreter）。",
    },
  },
  reportMissingModuleSource: {
    title: { en: "Stub found, package missing", "zh-TW": "有型別存根但沒安裝套件" },
    hint: { en: "Install the package itself, not only its stubs.", "zh-TW": "要安裝套件本身，而不只是型別存根。" },
  },
  reportMissingTypeStubs: { title: { en: "Missing type stubs", "zh-TW": "缺少型別存根" } },
  reportUndefinedVariable: {
    title: { en: "Undefined name", "zh-TW": "名稱未定義" },
    hint: { en: "Typo, missing import, or used before it's defined.", "zh-TW": "可能是拼錯、忘了 import，或在定義之前就使用。" },
  },
  reportPossiblyUnbound: {
    title: { en: "Possibly unbound", "zh-TW": "可能未賦值" },
    hint: {
      en: "On some path (an `if`, `try` or loop) the variable is never assigned. Give it a default before the branch.",
      "zh-TW": "在某些路徑（`if`、`try` 或迴圈）中變數從未被賦值。在分支前先給它預設值。",
    },
  },
  reportIncompatibleMethodOverride: {
    title: { en: "Incompatible override", "zh-TW": "覆寫方法不相容" },
    hint: {
      en: "A subclass method must accept at least what the parent accepts and return something compatible.",
      "zh-TW": "子類別的方法至少要接受父類別能接受的參數，回傳的型別也要相容。",
    },
  },
  reportIncompatibleVariableOverride: { title: { en: "Incompatible override", "zh-TW": "覆寫屬性不相容" } },
  reportAbstractUsage: { title: { en: "Abstract class", "zh-TW": "抽象類別" } },
  reportRedeclaration: { title: { en: "Redeclaration", "zh-TW": "重複宣告" } },
  reportTypedDictNotRequiredAccess: { title: { en: "Key may be missing", "zh-TW": "鍵可能不存在" } },
  reportPrivateImportUsage: { title: { en: "Private import", "zh-TW": "使用了非公開的匯入" } },
  reportUnusedVariable: { title: { en: "Unused variable", "zh-TW": "未使用的變數" } },
  reportUnusedImport: { title: { en: "Unused import", "zh-TW": "未使用的匯入" } },
  reportGeneralTypeIssues: { title: { en: "Type issue", "zh-TW": "型別問題" } },

  // mypy
  "arg-type": {
    title: { en: "Argument type mismatch", "zh-TW": "引數型別不符" },
    hint: {
      en: "The value you pass doesn't match the parameter's annotation.",
      "zh-TW": "傳入的值和參數的型別註記不符。",
    },
  },
  assignment: {
    title: { en: "Assignment type mismatch", "zh-TW": "賦值型別不符" },
    hint: {
      en: "The value doesn't match the variable's declared type.",
      "zh-TW": "賦予的值和變數宣告的型別不符。",
    },
  },
  "return-value": { title: { en: "Return type mismatch", "zh-TW": "回傳型別不符" } },
  "attr-defined": {
    title: { en: "Unknown attribute", "zh-TW": "屬性不存在" },
    hint: { en: "Check for a typo or a missing import.", "zh-TW": "檢查是否拼錯或漏了 import。" },
  },
  "union-attr": {
    title: { en: "Attribute missing on part of a union", "zh-TW": "聯集中有型別沒有這個屬性" },
    hint: {
      en: "Usually one member is `None`. Narrow it with `if x is not None:` first.",
      "zh-TW": "通常是聯集中有 `None`。先用 `if x is not None:` 縮小型別。",
    },
  },
  "name-defined": { title: { en: "Undefined name", "zh-TW": "名稱未定義" } },
  "import-not-found": {
    title: { en: "Import not found", "zh-TW": "找不到匯入的模組" },
    hint: {
      en: "Install the package in the environment mypy runs in.",
      "zh-TW": "在 mypy 執行的環境中安裝這個套件。",
    },
  },
  "import-untyped": {
    title: { en: "Package has no type hints", "zh-TW": "套件沒有型別資訊" },
    hint: {
      en: "Install its stubs (often `types-<package>`), or ignore it in your mypy config.",
      "zh-TW": "安裝它的型別存根（通常叫 `types-<套件名>`），或在 mypy 設定中忽略它。",
    },
  },
  operator: { title: { en: "Unsupported operation", "zh-TW": "不支援的運算" } },
  "call-arg": { title: { en: "Bad call", "zh-TW": "呼叫方式錯誤" } },
  "typeddict-item": { title: { en: "TypedDict item mismatch", "zh-TW": "TypedDict 欄位型別不符" } },
  "list-item": { title: { en: "List item mismatch", "zh-TW": "串列元素型別不符" } },
  "dict-item": { title: { en: "Dict item mismatch", "zh-TW": "字典項目型別不符" } },
  override: { title: { en: "Incompatible override", "zh-TW": "覆寫方法不相容" } },
  "var-annotated": { title: { en: "Needs a type annotation", "zh-TW": "需要型別註記" } },
  "return": { title: { en: "Missing return", "zh-TW": "缺少 return" } },
  index: { title: { en: "Bad index", "zh-TW": "索引錯誤" } },
  misc: { title: { en: "Type issue", "zh-TW": "型別問題" } },
};

const FALLBACK_TITLE: Record<Locale, string> = { en: "Type error", "zh-TW": "型別錯誤" };

export function ruleTitle(rule: string | undefined, locale: Locale): string {
  return (rule && RULES[rule]?.title[locale]) || FALLBACK_TITLE[locale];
}

/** Hints triggered by what the message says, which beat the generic per-rule hint. */
const MESSAGE_HINTS: Array<[RegExp, Record<Locale, string>]> = [
  [/is invariant/, {
    en: "`list` and `dict` are invariant: a `list[int]` is not a `list[int | str]`, even though every `int` is an `int | str`. If the function only reads the argument, annotate it with `Sequence[...]` / `Mapping[...]` instead.",
    "zh-TW": "`list` 和 `dict` 是不變的 (invariant)：`list[int]` 不算是 `list[int | str]`，即使每個 `int` 都是 `int | str`。如果函式只會讀取這個參數，改用 `Sequence[...]` / `Mapping[...]` 標註就好。",
  }],
  [/is possibly unbound/, {
    en: "Give the variable a value before the `if` / `try` / loop so every path defines it.",
    "zh-TW": "在 `if` / `try` / 迴圈之前先給變數一個值，讓每條路徑都有定義。",
  }],
  [/"None"/, {
    en: "Something here can be `None`. Narrow it first with `if x is not None:`.",
    "zh-TW": "這裡有值可能是 `None`。先用 `if x is not None:` 排除它。",
  }],
];

export function ruleHint(rule: string | undefined, locale: Locale, message = ""): string | undefined {
  for (const [pattern, hint] of MESSAGE_HINTS) if (pattern.test(message)) return hint[locale];
  return rule ? RULES[rule]?.hint?.[locale] : undefined;
}

export function ruleDocsUrl(rule: string | undefined, checker: Checker): string | undefined {
  if (!rule) return undefined;
  if (checker === "mypy") {
    return `https://mypy.readthedocs.io/en/stable/error_code_list.html#code-${encodeURIComponent(rule)}`;
  }
  if (/^report[A-Za-z]+$/.test(rule)) {
    return `https://microsoft.github.io/pyright/#/configuration?id=${rule}`;
  }
  return undefined;
}

export function checkerFromSource(source: string | undefined): Checker | undefined {
  const s = (source ?? "").toLowerCase();
  if (s.includes("mypy")) return "mypy";
  if (s.includes("pylance") || s.includes("pyright") || s.includes("basedpyright")) return "pyright";
  return undefined;
}
