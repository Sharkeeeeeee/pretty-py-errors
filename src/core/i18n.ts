/**
 * Translations of the most common Pyright / Pylance / mypy message patterns.
 * Quoted parts ("...") are kept verbatim so they are still rendered as code.
 */

export type Locale = "en" | "zh-TW";

type Pattern = [RegExp, string];

const Q = '"([^"\\n]+)"';
const re = (src: string) => new RegExp("^" + src.replace(/QQ/g, Q) + "$");

const ZH_TW: Pattern[] = [
  // ---- Pyright / Pylance ----
  [re("Argument of type QQ cannot be assigned to parameter QQ of type QQ in function QQ"),
    '型別為 "$1" 的引數，無法指派給函式 "$4" 的參數 "$2"（型別 "$3"）'],
  [re("Argument of type QQ cannot be assigned to parameter QQ of type QQ"),
    '型別為 "$1" 的引數，無法指派給參數 "$2"（型別 "$3"）'],
  [re("Type QQ is not assignable to declared type QQ"), '型別 "$1" 無法指派給宣告的型別 "$2"'],
  [re("Type QQ is not assignable to return type QQ"), '型別 "$1" 無法指派給回傳型別 "$2"'],
  [re("Type QQ is not assignable to type QQ"), '型別 "$1" 無法指派給型別 "$2"'],
  [re("QQ is not assignable to type QQ"), '"$1" 無法指派給型別 "$2"'],
  [re("QQ is not assignable to QQ"), '"$1" 無法指派給 "$2"'],
  [re("QQ is incompatible with protocol QQ"), '"$1" 不符合協定 (Protocol) "$2"'],
  [re("QQ is an incompatible type"), '"$1" 的型別不相容'],
  [re("QQ is not present"), '缺少 "$1"'],
  [re("Parameter (\\d+): type QQ is incompatible with type QQ"), '第 $1 個參數：型別 "$2" 與型別 "$3" 不相容'],
  [re("Parameter name mismatch: QQ versus QQ"), '參數名稱不一致："$1" 與 "$2"'],
  [re("Function return type QQ is incompatible with type QQ"), '函式回傳型別 "$1" 與型別 "$2" 不相容'],
  [re("Function accepts too few positional parameters; expected (\\d+) but received (\\d+)"),
    "函式接受的位置參數太少：預期 $1 個，實際 $2 個"],
  [re("Function accepts too many positional parameters; expected (\\d+) but received (\\d+)"),
    "函式接受的位置參數太多：預期 $1 個，實際 $2 個"],
  [re("Expected (\\d+) positional arguments?"), "預期 $1 個位置引數"],
  [re("Argument missing for parameter QQ"), '缺少參數 "$1" 的引數'],
  [re("Arguments missing for parameters (.+)"), "缺少下列參數的引數：$1"],
  [re("No parameter named QQ"), '沒有名為 "$1" 的參數'],
  [re("Import QQ could not be resolved"), '無法解析匯入 "$1"'],
  [re("Import QQ could not be resolved from source"), '無法從原始碼解析匯入 "$1"'],
  [re("QQ is not defined"), '"$1" 尚未定義'],
  [re("QQ is possibly unbound"), '"$1" 可能尚未綁定（某些路徑下沒有被賦值）'],
  [re("QQ is unbound"), '"$1" 尚未綁定'],
  [re("Operator QQ not supported for QQ"), '"$2" 不支援運算子 "$1"'],
  [re("Operator QQ not supported for types QQ and QQ"), '型別 "$2" 與 "$3" 之間不支援運算子 "$1"'],
  [re("Cannot access attribute QQ for class QQ"), '無法存取類別 "$2" 的屬性 "$1"'],
  [re("Attribute QQ is unknown"), '屬性 "$1" 不存在'],
  [re("QQ is not a known attribute of module QQ"), '"$1" 不是模組 "$2" 的已知屬性'],
  [re("QQ is not a known attribute of QQ"), '"$1" 不是 "$2" 的已知屬性'],
  [re("Object of type QQ is not subscriptable"), '型別為 "$1" 的物件不能使用下標 []'],
  [re("Object of type QQ is not callable"), '型別為 "$1" 的物件不能被呼叫'],
  [re("Object of type QQ cannot be used as iterable value"), '型別為 "$1" 的物件不能被迭代'],
  [re("QQ is not iterable"), '"$1" 不可迭代'],
  [re("Cannot instantiate abstract class QQ"), '無法實例化抽象類別 "$1"'],
  [re("Method QQ overrides class QQ in an incompatible manner"), '方法 "$1" 以不相容的方式覆寫了類別 "$2" 的方法'],
  [re("Return type mismatch: base method returns type QQ, override returns type QQ"),
    '回傳型別不一致：父類別方法回傳 "$1"，覆寫後回傳 "$2"'],
  [re("Function with declared return type QQ must return value on all code paths"),
    '宣告回傳型別為 "$1" 的函式，必須在所有路徑都回傳值'],
  [re("\"None\" is not assignable to QQ"), '"None" 無法指派給 "$1"'],
  [re("Type parameter QQ is invariant, but QQ is not the same as QQ"),
    '型別參數 "$1" 是不變的 (invariant)，但 "$2" 和 "$3" 不是同一個型別'],
  [re("Type parameter QQ is covariant, but QQ is not a subtype of QQ"),
    '型別參數 "$1" 是協變的 (covariant)，但 "$2" 不是 "$3" 的子型別'],
  [re("Consider switching from QQ to QQ which is covariant"), '可以考慮把 "$1" 換成協變的 "$2"'],
  [re("Consider switching from QQ to QQ which is covariant in the value type"), '可以考慮把 "$1" 換成值型別協變的 "$2"'],
  [re("Consider switching from QQ to QQ which is covariant in the key type"), '可以考慮把 "$1" 換成鍵型別協變的 "$2"'],
  [re("Code is unreachable"), "這段程式碼永遠不會被執行"],
  [re("Expression value is unused"), "運算式的結果沒有被使用"],
  [re("QQ is not accessed"), '"$1" 沒有被使用'],

  // ---- mypy ----
  [re("Argument (\\d+) to QQ has incompatible type QQ; expected QQ"),
    '傳給 "$2" 的第 $1 個引數型別不相容：得到 "$3"，預期 "$4"'],
  [re("Argument QQ to QQ has incompatible type QQ; expected QQ"),
    '傳給 "$2" 的引數 "$1" 型別不相容：得到 "$3"，預期 "$4"'],
  [re("Incompatible types in assignment \\(expression has type QQ, variable has type QQ\\)"),
    '賦值型別不相容（運算式型別 "$1"，變數型別 "$2"）'],
  [re("Incompatible return value type \\(got QQ, expected QQ\\)"),
    '回傳值型別不相容（得到 "$1"，預期 "$2"）'],
  [re("Incompatible types \\(expression has type QQ, TypedDict item QQ has type QQ\\)"),
    '型別不相容（運算式型別 "$1"，TypedDict 欄位 "$2" 的型別是 "$3"）'],
  [re("List item (\\d+) has incompatible type QQ; expected QQ"), '串列第 $1 個元素型別不相容：得到 "$2"，預期 "$3"'],
  [re("Name QQ is not defined"), '名稱 "$1" 尚未定義'],
  [re("QQ has no attribute QQ"), '"$1" 沒有屬性 "$2"'],
  [re("Item QQ of QQ has no attribute QQ"), '"$2" 中的 "$1" 沒有屬性 "$3"'],
  [re("Module QQ has no attribute QQ"), '模組 "$1" 沒有屬性 "$2"'],
  [re("Cannot find implementation or library stub for module named QQ"), '找不到模組 "$1" 的實作或型別存根 (stub)'],
  [re("Library stubs not installed for QQ"), '尚未安裝 "$1" 的型別存根 (stub)'],
  [re("Unsupported operand types for (\\S+) \\(QQ and QQ\\)"), '運算子 $1 不支援 "$2" 與 "$3" 這兩種型別'],
  [re("Unsupported left operand type for (\\S+) \\(QQ\\)"), '運算子 $1 不支援左側型別 "$2"'],
  [re("Left operand is of type QQ"), '左側運算元的型別是 "$1"'],
  [re("Missing return statement"), "缺少 return 陳述式"],
  [re("Cannot infer type of lambda"), "無法推斷 lambda 的型別"],
  [re("Need type annotation for QQ(.*)"), '"$1" 需要型別註記$2'],
  [re("Too few arguments for QQ"), '呼叫 "$1" 的引數太少'],
  [re("Too many arguments for QQ"), '呼叫 "$1" 的引數太多'],
  [re("Unexpected keyword argument QQ for QQ"), '"$2" 沒有關鍵字參數 "$1"'],
  [re("Following member\\(s\\) of QQ have conflicts:"), '"$1" 的下列成員有衝突：'],
  [re("Expected:"), "預期："],
  [re("Got:"), "實際："],
];

const TABLES: Record<Locale, Pattern[]> = { en: [], "zh-TW": ZH_TW };

/** Translates one line (without leading indentation). Unknown lines are returned unchanged. */
export function translateLine(line: string, locale: Locale): string {
  for (const [pattern, replacement] of TABLES[locale]) {
    if (pattern.test(line)) return line.replace(pattern, replacement);
  }
  return line;
}

/** Translates a whole multi-line message, keeping Pyright's indentation. */
export function translateMessage(message: string, locale: Locale): string {
  if (locale === "en") return message;
  return message
    .split("\n")
    .map((line) => {
      const indent = line.match(/^\s*/)?.[0] ?? "";
      return indent + translateLine(line.slice(indent.length).trimEnd(), locale);
    })
    .join("\n");
}

export function resolveLocale(setting: string | undefined, uiLanguage: string | undefined): Locale {
  const value = (setting && setting !== "auto" ? setting : uiLanguage ?? "en").toLowerCase();
  if (value === "zh-tw" || value === "zh-hant" || value.startsWith("zh-hant") || value === "zh-hk") return "zh-TW";
  return "en";
}
