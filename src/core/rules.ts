import type { Locale } from "./i18n";

export type Checker = "pyright" | "mypy";

type Text = Record<Locale, string>;

interface RuleInfo {
  title: Text;
  hint?: Text;
}

// ------------------------------------------------------------------ titles

const T = {
  argType: { en: "Argument type mismatch", "zh-TW": "引數型別不符", "zh-CN": "实参类型不匹配", ja: "引数の型が一致しません", ko: "인수 형식 불일치" },
  assignType: { en: "Assignment type mismatch", "zh-TW": "賦值型別不符", "zh-CN": "赋值类型不匹配", ja: "代入の型が一致しません", ko: "할당 형식 불일치" },
  returnType: { en: "Return type mismatch", "zh-TW": "回傳型別不符", "zh-CN": "返回类型不匹配", ja: "戻り値の型が一致しません", ko: "반환 형식 불일치" },
  unknownAttr: { en: "Unknown attribute", "zh-TW": "屬性不存在", "zh-CN": "属性不存在", ja: "存在しない属性", ko: "알 수 없는 특성" },
  maybeNone: { en: "Value may be None", "zh-TW": "值可能是 None", "zh-CN": "值可能为 None", ja: "値が None の可能性があります", ko: "값이 None일 수 있음" },
  badCall: { en: "Bad call", "zh-TW": "呼叫方式錯誤", "zh-CN": "调用方式错误", ja: "呼び出しが正しくありません", ko: "잘못된 호출" },
  badIndex: { en: "Bad index", "zh-TW": "索引錯誤", "zh-CN": "索引错误", ja: "インデックスが正しくありません", ko: "잘못된 인덱스" },
  importNotFound: { en: "Import not found", "zh-TW": "找不到匯入的模組", "zh-CN": "找不到导入的模块", ja: "インポートが見つかりません", ko: "가져오기를 찾을 수 없음" },
  stubOnly: { en: "Stub found, package missing", "zh-TW": "有型別存根但沒安裝套件", "zh-CN": "有类型存根但未安装包", ja: "スタブはあるがパッケージがありません", ko: "스텁은 있지만 패키지가 없음" },
  missingStubs: { en: "Missing type stubs", "zh-TW": "缺少型別存根", "zh-CN": "缺少类型存根", ja: "型スタブがありません", ko: "형식 스텁 없음" },
  undefinedName: { en: "Undefined name", "zh-TW": "名稱未定義", "zh-CN": "名称未定义", ja: "未定義の名前", ko: "정의되지 않은 이름" },
  unbound: { en: "Possibly unbound", "zh-TW": "可能未賦值", "zh-CN": "可能未赋值", ja: "未代入の可能性", ko: "할당되지 않았을 수 있음" },
  override: { en: "Incompatible override", "zh-TW": "覆寫不相容", "zh-CN": "重写不兼容", ja: "互換性のないオーバーライド", ko: "호환되지 않는 재정의" },
  abstract: { en: "Abstract class", "zh-TW": "抽象類別", "zh-CN": "抽象类", ja: "抽象クラス", ko: "추상 클래스" },
  redeclaration: { en: "Redeclaration", "zh-TW": "重複宣告", "zh-CN": "重复声明", ja: "再宣言", ko: "재선언" },
  keyMissing: { en: "Key may be missing", "zh-TW": "鍵可能不存在", "zh-CN": "键可能不存在", ja: "キーが存在しない可能性があります", ko: "키가 없을 수 있음" },
  privateImport: { en: "Private import", "zh-TW": "使用了非公開的匯入", "zh-CN": "使用了非公开的导入", ja: "非公開のインポート", ko: "비공개 가져오기" },
  unusedVar: { en: "Unused variable", "zh-TW": "未使用的變數", "zh-CN": "未使用的变量", ja: "未使用の変数", ko: "사용되지 않는 변수" },
  unusedImport: { en: "Unused import", "zh-TW": "未使用的匯入", "zh-CN": "未使用的导入", ja: "未使用のインポート", ko: "사용되지 않는 가져오기" },
  typeIssue: { en: "Type issue", "zh-TW": "型別問題", "zh-CN": "类型问题", ja: "型の問題", ko: "형식 문제" },
  unionAttr: { en: "Attribute missing on part of a union", "zh-TW": "聯集中有型別沒有這個屬性", "zh-CN": "联合类型中有成员没有该属性", ja: "Union の一部に属性がありません", ko: "유니온 일부에 특성이 없음" },
  untyped: { en: "Package has no type hints", "zh-TW": "套件沒有型別資訊", "zh-CN": "包没有类型信息", ja: "パッケージに型情報がありません", ko: "패키지에 형식 정보가 없음" },
  operator: { en: "Unsupported operation", "zh-TW": "不支援的運算", "zh-CN": "不支持的运算", ja: "サポートされていない演算", ko: "지원되지 않는 연산" },
  typedDictItem: { en: "TypedDict item mismatch", "zh-TW": "TypedDict 欄位型別不符", "zh-CN": "TypedDict 项类型不匹配", ja: "TypedDict の項目の型が一致しません", ko: "TypedDict 항목 형식 불일치" },
  listItem: { en: "List item mismatch", "zh-TW": "串列元素型別不符", "zh-CN": "列表项类型不匹配", ja: "リスト要素の型が一致しません", ko: "리스트 항목 형식 불일치" },
  dictItem: { en: "Dict item mismatch", "zh-TW": "字典項目型別不符", "zh-CN": "字典项类型不匹配", ja: "辞書項目の型が一致しません", ko: "딕셔너리 항목 형식 불일치" },
  needsAnnotation: { en: "Needs a type annotation", "zh-TW": "需要型別註記", "zh-CN": "需要类型注解", ja: "型注釈が必要です", ko: "형식 주석 필요" },
  missingReturn: { en: "Missing return", "zh-TW": "缺少 return", "zh-CN": "缺少 return", ja: "return がありません", ko: "return 누락" },
} satisfies Record<string, Text>;

// ------------------------------------------------------------------- hints

const H = {
  argType: {
    en: "The value you pass doesn't match the parameter's annotation. Read the indented lines from the bottom up: the deepest one is the actual conflict.",
    "zh-TW": "傳入的值和參數的型別註記不符。從最下面那行往上讀：縮排最深的那行才是真正衝突的地方。",
    "zh-CN": "传入的值与形参的类型注解不匹配。从最下面一行往上读：缩进最深的那一行才是真正冲突的地方。",
    ja: "渡した値がパラメーターの型注釈と一致しません。インデントの一番深い行から上に読んでください。そこが実際の衝突箇所です。",
    ko: "전달한 값이 매개변수의 형식 주석과 맞지 않습니다. 가장 깊게 들여쓴 줄부터 위로 읽으세요. 그 줄이 실제 충돌 지점입니다.",
  },
  assignType: {
    en: "The value doesn't match the variable's declared type. Fix the value, or widen the annotation (e.g. `int | None`).",
    "zh-TW": "賦予的值和變數宣告的型別不符。修正這個值，或放寬型別註記（例如 `int | None`）。",
    "zh-CN": "赋予的值与变量声明的类型不匹配。修正这个值，或放宽类型注解（例如 `int | None`）。",
    ja: "値が変数の宣言された型と一致しません。値を修正するか、型注釈を広げてください（例: `int | None`）。",
    ko: "값이 변수의 선언된 형식과 맞지 않습니다. 값을 고치거나 형식 주석을 넓히세요(예: `int | None`).",
  },
  returnType: {
    en: "What the function returns doesn't match its `-> ...` annotation.",
    "zh-TW": "函式實際回傳的值和 `-> ...` 註記的型別不符。",
    "zh-CN": "函数实际返回的值与 `-> ...` 注解的类型不匹配。",
    ja: "関数が返す値が `-> ...` の型注釈と一致しません。",
    ko: "함수가 반환하는 값이 `-> ...` 주석과 맞지 않습니다.",
  },
  unknownAttr: {
    en: "Check for a typo, or whether the object could be a different type (often `None`) at this point.",
    "zh-TW": "檢查是否拼錯，或這個物件在這裡可能是別的型別（常見是 `None`）。",
    "zh-CN": "检查是否拼写错误，或者该对象在这里可能是别的类型（常见的是 `None`）。",
    ja: "タイプミスがないか、またはこの時点でオブジェクトが別の型（多くは `None`）になり得ないか確認してください。",
    ko: "오타가 없는지, 또는 이 시점에 객체가 다른 형식(주로 `None`)일 수 있는지 확인하세요.",
  },
  noneGuard: {
    en: "Guard it first: `if x is not None:` (or `assert x is not None`).",
    "zh-TW": "先排除 None：`if x is not None:`（或 `assert x is not None`）。",
    "zh-CN": "先排除 None：`if x is not None:`（或 `assert x is not None`）。",
    ja: "先に `if x is not None:`（または `assert x is not None`）で None を除外してください。",
    ko: "먼저 `if x is not None:`(또는 `assert x is not None`)로 None을 걸러내세요.",
  },
  badCall: {
    en: "The number or names of the arguments don't match the function's signature.",
    "zh-TW": "引數的數量或名稱和函式簽章對不上。",
    "zh-CN": "实参的数量或名称与函数签名不匹配。",
    ja: "引数の数または名前が関数のシグネチャと一致しません。",
    ko: "인수의 개수나 이름이 함수 시그니처와 맞지 않습니다.",
  },
  importNotFound: {
    en: "Install the package in the interpreter VS Code is using, or select the right interpreter (Python: Select Interpreter).",
    "zh-TW": "在 VS Code 目前使用的直譯器裡安裝這個套件，或切換到正確的直譯器（Python: Select Interpreter）。",
    "zh-CN": "在 VS Code 当前使用的解释器中安装这个包，或切换到正确的解释器（Python: Select Interpreter）。",
    ja: "VS Code が使用しているインタープリターにパッケージをインストールするか、正しいインタープリターを選択してください（Python: Select Interpreter）。",
    ko: "VS Code가 사용하는 인터프리터에 패키지를 설치하거나 올바른 인터프리터를 선택하세요(Python: Select Interpreter).",
  },
  mypyImport: {
    en: "Install the package in the environment mypy runs in.",
    "zh-TW": "在 mypy 執行的環境中安裝這個套件。",
    "zh-CN": "在 mypy 运行的环境中安装这个包。",
    ja: "mypy を実行している環境にパッケージをインストールしてください。",
    ko: "mypy가 실행되는 환경에 패키지를 설치하세요.",
  },
  stubOnly: {
    en: "Install the package itself, not only its stubs.",
    "zh-TW": "要安裝套件本身，而不只是型別存根。",
    "zh-CN": "要安装包本身，而不只是类型存根。",
    ja: "スタブだけでなく、パッケージ本体をインストールしてください。",
    ko: "스텁뿐 아니라 패키지 자체를 설치하세요.",
  },
  undefinedName: {
    en: "Typo, missing import, or used before it's defined.",
    "zh-TW": "可能是拼錯、忘了 import，或在定義之前就使用。",
    "zh-CN": "可能是拼写错误、忘了 import，或在定义之前就使用。",
    ja: "タイプミス、import 漏れ、または定義前の使用が考えられます。",
    ko: "오타, import 누락, 또는 정의되기 전에 사용했을 수 있습니다.",
  },
  unbound: {
    en: "Give the variable a value before the `if` / `try` / loop so every path defines it.",
    "zh-TW": "在 `if` / `try` / 迴圈之前先給變數一個值，讓每條路徑都有定義。",
    "zh-CN": "在 `if` / `try` / 循环之前先给变量一个值，让每条路径都有定义。",
    ja: "`if` / `try` / ループの前に変数へ値を代入し、すべての経路で定義されるようにしてください。",
    ko: "`if` / `try` / 반복문 앞에서 변수에 값을 할당해 모든 경로에서 정의되게 하세요.",
  },
  override: {
    en: "A subclass method must accept at least what the parent accepts and return something compatible.",
    "zh-TW": "子類別的方法至少要接受父類別能接受的參數，回傳的型別也要相容。",
    "zh-CN": "子类的方法至少要接受父类能接受的参数，返回的类型也要兼容。",
    ja: "サブクラスのメソッドは、少なくとも親クラスと同じ引数を受け取り、互換性のある型を返す必要があります。",
    ko: "하위 클래스 메서드는 최소한 부모가 받는 인수를 받고 호환되는 형식을 반환해야 합니다.",
  },
  unionAttr: {
    en: "Usually one member is `None`. Narrow it with `if x is not None:` first.",
    "zh-TW": "通常是聯集中有 `None`。先用 `if x is not None:` 縮小型別。",
    "zh-CN": "通常是联合类型中有 `None`。先用 `if x is not None:` 收窄类型。",
    ja: "多くの場合、Union の一部が `None` です。先に `if x is not None:` で絞り込んでください。",
    ko: "보통 유니온 중 하나가 `None`입니다. 먼저 `if x is not None:`로 좁히세요.",
  },
  untyped: {
    en: "Install its stubs (often `types-<package>`), or ignore it in your mypy config.",
    "zh-TW": "安裝它的型別存根（通常叫 `types-<套件名>`），或在 mypy 設定中忽略它。",
    "zh-CN": "安装它的类型存根（通常叫 `types-<包名>`），或在 mypy 配置中忽略它。",
    ja: "スタブ（多くは `types-<パッケージ名>`）をインストールするか、mypy の設定で無視してください。",
    ko: "스텁(보통 `types-<패키지명>`)을 설치하거나 mypy 설정에서 무시하세요.",
  },
  invariant: {
    en: "`list` and `dict` are invariant: a `list[int]` is not a `list[int | str]`, even though every `int` is an `int | str`. If the function only reads the argument, annotate it with `Sequence[...]` / `Mapping[...]` instead.",
    "zh-TW": "`list` 和 `dict` 是不變的 (invariant)：`list[int]` 不算是 `list[int | str]`，即使每個 `int` 都是 `int | str`。如果函式只會讀取這個參數，改用 `Sequence[...]` / `Mapping[...]` 標註就好。",
    "zh-CN": "`list` 和 `dict` 是不变的 (invariant)：`list[int]` 不算是 `list[int | str]`，即使每个 `int` 都是 `int | str`。如果函数只读取这个参数，改用 `Sequence[...]` / `Mapping[...]` 注解即可。",
    ja: "`list` と `dict` は不変 (invariant) です。すべての `int` は `int | str` ですが、`list[int]` は `list[int | str]` ではありません。関数が引数を読むだけなら、`Sequence[...]` / `Mapping[...]` で注釈してください。",
    ko: "`list`와 `dict`는 불변(invariant)입니다. 모든 `int`가 `int | str`이어도 `list[int]`는 `list[int | str]`가 아닙니다. 함수가 인수를 읽기만 한다면 `Sequence[...]` / `Mapping[...]`로 주석하세요.",
  },
  maybeNone: {
    en: "Something here can be `None`. Narrow it first with `if x is not None:`.",
    "zh-TW": "這裡有值可能是 `None`。先用 `if x is not None:` 排除它。",
    "zh-CN": "这里有值可能为 `None`。先用 `if x is not None:` 排除它。",
    ja: "ここには `None` になり得る値があります。先に `if x is not None:` で絞り込んでください。",
    ko: "여기에 `None`일 수 있는 값이 있습니다. 먼저 `if x is not None:`로 좁히세요.",
  },
} satisfies Record<string, Text>;

/** Short titles and fix hints for the rules people hit most often. */
const RULES: Record<string, RuleInfo> = {
  // Pyright / Pylance / basedpyright
  reportArgumentType: { title: T.argType, hint: H.argType },
  reportAssignmentType: { title: T.assignType, hint: H.assignType },
  reportReturnType: { title: T.returnType, hint: H.returnType },
  reportAttributeAccessIssue: { title: T.unknownAttr, hint: H.unknownAttr },
  reportOptionalMemberAccess: { title: T.maybeNone, hint: H.noneGuard },
  reportOptionalOperand: { title: T.maybeNone, hint: H.noneGuard },
  reportOptionalSubscript: { title: T.maybeNone, hint: H.noneGuard },
  reportOptionalIterable: { title: T.maybeNone, hint: H.noneGuard },
  reportOptionalCall: { title: T.maybeNone, hint: H.noneGuard },
  reportCallIssue: { title: T.badCall, hint: H.badCall },
  reportIndexIssue: { title: T.badIndex },
  reportMissingImports: { title: T.importNotFound, hint: H.importNotFound },
  reportMissingModuleSource: { title: T.stubOnly, hint: H.stubOnly },
  reportMissingTypeStubs: { title: T.missingStubs },
  reportUndefinedVariable: { title: T.undefinedName, hint: H.undefinedName },
  reportPossiblyUnbound: { title: T.unbound, hint: H.unbound },
  reportIncompatibleMethodOverride: { title: T.override, hint: H.override },
  reportIncompatibleVariableOverride: { title: T.override },
  reportAbstractUsage: { title: T.abstract },
  reportRedeclaration: { title: T.redeclaration },
  reportTypedDictNotRequiredAccess: { title: T.keyMissing },
  reportPrivateImportUsage: { title: T.privateImport },
  reportUnusedVariable: { title: T.unusedVar },
  reportUnusedImport: { title: T.unusedImport },
  reportGeneralTypeIssues: { title: T.typeIssue },

  // mypy
  "arg-type": { title: T.argType, hint: H.argType },
  assignment: { title: T.assignType, hint: H.assignType },
  "return-value": { title: T.returnType, hint: H.returnType },
  "attr-defined": { title: T.unknownAttr, hint: H.unknownAttr },
  "union-attr": { title: T.unionAttr, hint: H.unionAttr },
  "name-defined": { title: T.undefinedName, hint: H.undefinedName },
  "import-not-found": { title: T.importNotFound, hint: H.mypyImport },
  "import-untyped": { title: T.untyped, hint: H.untyped },
  operator: { title: T.operator },
  "call-arg": { title: T.badCall, hint: H.badCall },
  "typeddict-item": { title: T.typedDictItem },
  "list-item": { title: T.listItem },
  "dict-item": { title: T.dictItem },
  override: { title: T.override, hint: H.override },
  "var-annotated": { title: T.needsAnnotation },
  return: { title: T.missingReturn },
  index: { title: T.badIndex },
  misc: { title: T.typeIssue },
};

const FALLBACK_TITLE: Text = { en: "Type error", "zh-TW": "型別錯誤", "zh-CN": "类型错误", ja: "型エラー", ko: "형식 오류" };

/** Own-property lookup, so names like "constructor" or "__proto__" never hit Object.prototype. */
function ruleInfo(rule: string | undefined): RuleInfo | undefined {
  return rule !== undefined && Object.hasOwn(RULES, rule) ? RULES[rule] : undefined;
}

export function ruleTitle(rule: string | undefined, locale: Locale): string {
  return ruleInfo(rule)?.title[locale] || FALLBACK_TITLE[locale];
}

/** Hints triggered by what the message says, which beat the generic per-rule hint. */
const MESSAGE_HINTS: Array<[RegExp, Text]> = [
  [/is invariant/, H.invariant],
  [/is possibly unbound/, H.unbound],
  [/"None"/, H.maybeNone],
];

export function ruleHint(rule: string | undefined, locale: Locale, message = ""): string | undefined {
  for (const [pattern, hint] of MESSAGE_HINTS) if (pattern.test(message)) return hint[locale];
  return ruleInfo(rule)?.hint?.[locale];
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
