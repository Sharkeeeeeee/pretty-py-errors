/**
 * Translations of the most common Pyright / Pylance / mypy message patterns.
 * Quoted parts ("...") are kept verbatim so they are still rendered as code.
 */

export type Locale = "en" | "zh-TW" | "zh-CN" | "ja" | "ko";
export type TranslatedLocale = Exclude<Locale, "en">;

export const LOCALES: readonly Locale[] = ["en", "zh-TW", "zh-CN", "ja", "ko"];

type Translations = Record<TranslatedLocale, string>;
type Pattern = [RegExp, Translations];

const Q = '"([^"\\n]+)"';
const re = (src: string) => new RegExp("^" + src.replace(/QQ/g, Q) + "$");

/** More specific patterns must come before more general ones. */
const PATTERNS: Pattern[] = [
  // ---------------------------------------------------------------- Pyright / Pylance
  [re("Argument of type QQ cannot be assigned to parameter QQ of type QQ in function QQ"), {
    "zh-TW": '型別為 "$1" 的引數，無法指派給函式 "$4" 的參數 "$2"（型別 "$3"）',
    "zh-CN": '类型为 "$1" 的实参无法赋给函数 "$4" 的形参 "$2"（类型 "$3"）',
    ja: '型 "$1" の引数を、関数 "$4" のパラメーター "$2"（型 "$3"）に割り当てることはできません',
    ko: '"$1" 형식의 인수를 함수 "$4"의 매개변수 "$2"("$3" 형식)에 할당할 수 없습니다',
  }],
  [re("Argument of type QQ cannot be assigned to parameter QQ of type QQ"), {
    "zh-TW": '型別為 "$1" 的引數，無法指派給參數 "$2"（型別 "$3"）',
    "zh-CN": '类型为 "$1" 的实参无法赋给形参 "$2"（类型 "$3"）',
    ja: '型 "$1" の引数を、パラメーター "$2"（型 "$3"）に割り当てることはできません',
    ko: '"$1" 형식의 인수를 매개변수 "$2"("$3" 형식)에 할당할 수 없습니다',
  }],
  [re("Type QQ is not assignable to declared type QQ"), {
    "zh-TW": '型別 "$1" 無法指派給宣告的型別 "$2"',
    "zh-CN": '类型 "$1" 无法赋给声明的类型 "$2"',
    ja: '型 "$1" を宣言された型 "$2" に割り当てることはできません',
    ko: '"$1" 형식을 선언된 형식 "$2"에 할당할 수 없습니다',
  }],
  [re("Type QQ is not assignable to return type QQ"), {
    "zh-TW": '型別 "$1" 無法指派給回傳型別 "$2"',
    "zh-CN": '类型 "$1" 无法赋给返回类型 "$2"',
    ja: '型 "$1" を戻り値の型 "$2" に割り当てることはできません',
    ko: '"$1" 형식을 반환 형식 "$2"에 할당할 수 없습니다',
  }],
  [re("Type QQ is not assignable to type QQ"), {
    "zh-TW": '型別 "$1" 無法指派給型別 "$2"',
    "zh-CN": '类型 "$1" 无法赋给类型 "$2"',
    ja: '型 "$1" を型 "$2" に割り当てることはできません',
    ko: '"$1" 형식을 "$2" 형식에 할당할 수 없습니다',
  }],
  [re("QQ is not assignable to type QQ"), {
    "zh-TW": '"$1" 無法指派給型別 "$2"',
    "zh-CN": '"$1" 无法赋给类型 "$2"',
    ja: '"$1" を型 "$2" に割り当てることはできません',
    ko: '"$1"을(를) "$2" 형식에 할당할 수 없습니다',
  }],
  [re("QQ is not assignable to QQ"), {
    "zh-TW": '"$1" 無法指派給 "$2"',
    "zh-CN": '"$1" 无法赋给 "$2"',
    ja: '"$1" を "$2" に割り当てることはできません',
    ko: '"$1"을(를) "$2"에 할당할 수 없습니다',
  }],
  [re("QQ is incompatible with protocol QQ"), {
    "zh-TW": '"$1" 不符合協定 (Protocol) "$2"',
    "zh-CN": '"$1" 与协议 (Protocol) "$2" 不兼容',
    ja: '"$1" はプロトコル "$2" と互換性がありません',
    ko: '"$1"은(는) 프로토콜 "$2"과(와) 호환되지 않습니다',
  }],
  [re("QQ is an incompatible type"), {
    "zh-TW": '"$1" 的型別不相容',
    "zh-CN": '"$1" 的类型不兼容',
    ja: '"$1" の型に互換性がありません',
    ko: '"$1"의 형식이 호환되지 않습니다',
  }],
  [re("QQ is not present"), {
    "zh-TW": '缺少 "$1"',
    "zh-CN": '缺少 "$1"',
    ja: '"$1" がありません',
    ko: '"$1"이(가) 없습니다',
  }],
  [re("Parameter (\\d+): type QQ is incompatible with type QQ"), {
    "zh-TW": '第 $1 個參數：型別 "$2" 與型別 "$3" 不相容',
    "zh-CN": '第 $1 个参数：类型 "$2" 与类型 "$3" 不兼容',
    ja: 'パラメーター $1: 型 "$2" は型 "$3" と互換性がありません',
    ko: '매개변수 $1: "$2" 형식은 "$3" 형식과 호환되지 않습니다',
  }],
  [re("Parameter name mismatch: QQ versus QQ"), {
    "zh-TW": '參數名稱不一致："$1" 與 "$2"',
    "zh-CN": '参数名称不一致："$1" 与 "$2"',
    ja: 'パラメーター名が一致しません: "$1" と "$2"',
    ko: '매개변수 이름 불일치: "$1"과(와) "$2"',
  }],
  [re("Function return type QQ is incompatible with type QQ"), {
    "zh-TW": '函式回傳型別 "$1" 與型別 "$2" 不相容',
    "zh-CN": '函数返回类型 "$1" 与类型 "$2" 不兼容',
    ja: '関数の戻り値の型 "$1" は型 "$2" と互換性がありません',
    ko: '함수 반환 형식 "$1"은(는) "$2" 형식과 호환되지 않습니다',
  }],
  [re("Function accepts too few positional parameters; expected (\\d+) but received (\\d+)"), {
    "zh-TW": "函式接受的位置參數太少：預期 $1 個，實際 $2 個",
    "zh-CN": "函数接受的位置参数太少：应为 $1 个，实际 $2 个",
    ja: "関数が受け取る位置パラメーターが少なすぎます。$1 個必要ですが、$2 個です",
    ko: "함수가 받는 위치 매개변수가 너무 적습니다. $1개가 필요하지만 $2개입니다",
  }],
  [re("Function accepts too many positional parameters; expected (\\d+) but received (\\d+)"), {
    "zh-TW": "函式接受的位置參數太多：預期 $1 個，實際 $2 個",
    "zh-CN": "函数接受的位置参数太多：应为 $1 个，实际 $2 个",
    ja: "関数が受け取る位置パラメーターが多すぎます。$1 個必要ですが、$2 個です",
    ko: "함수가 받는 위치 매개변수가 너무 많습니다. $1개가 필요하지만 $2개입니다",
  }],
  [re("Expected (\\d+) positional arguments?"), {
    "zh-TW": "預期 $1 個位置引數",
    "zh-CN": "应为 $1 个位置实参",
    ja: "$1 個の位置引数が必要です",
    ko: "위치 인수 $1개가 필요합니다",
  }],
  [re("Argument missing for parameter QQ"), {
    "zh-TW": '缺少參數 "$1" 的引數',
    "zh-CN": '缺少形参 "$1" 的实参',
    ja: 'パラメーター "$1" の引数がありません',
    ko: '매개변수 "$1"에 대한 인수가 없습니다',
  }],
  [re("Arguments missing for parameters (.+)"), {
    "zh-TW": "缺少下列參數的引數：$1",
    "zh-CN": "缺少下列形参的实参：$1",
    ja: "次のパラメーターの引数がありません: $1",
    ko: "다음 매개변수에 대한 인수가 없습니다: $1",
  }],
  [re("No parameter named QQ"), {
    "zh-TW": '沒有名為 "$1" 的參數',
    "zh-CN": '没有名为 "$1" 的参数',
    ja: '"$1" という名前のパラメーターはありません',
    ko: '"$1"(이)라는 이름의 매개변수가 없습니다',
  }],
  [re("Import QQ could not be resolved"), {
    "zh-TW": '無法解析匯入 "$1"',
    "zh-CN": '无法解析导入 "$1"',
    ja: 'インポート "$1" を解決できませんでした',
    ko: '가져오기 "$1"을(를) 확인할 수 없습니다',
  }],
  [re("Import QQ could not be resolved from source"), {
    "zh-TW": '無法從原始碼解析匯入 "$1"',
    "zh-CN": '无法从源代码解析导入 "$1"',
    ja: 'インポート "$1" をソースから解決できませんでした',
    ko: '가져오기 "$1"을(를) 소스에서 확인할 수 없습니다',
  }],
  [re("QQ is not defined"), {
    "zh-TW": '"$1" 尚未定義',
    "zh-CN": '"$1" 未定义',
    ja: '"$1" は定義されていません',
    ko: '"$1"이(가) 정의되지 않았습니다',
  }],
  [re("QQ is possibly unbound"), {
    "zh-TW": '"$1" 可能尚未綁定（某些路徑下沒有被賦值）',
    "zh-CN": '"$1" 可能未绑定（某些路径下没有被赋值）',
    ja: '"$1" は未バインドの可能性があります（値が代入されない経路があります）',
    ko: '"$1"이(가) 바인딩되지 않았을 수 있습니다(값이 할당되지 않는 경로가 있음)',
  }],
  [re("QQ is unbound"), {
    "zh-TW": '"$1" 尚未綁定',
    "zh-CN": '"$1" 未绑定',
    ja: '"$1" はバインドされていません',
    ko: '"$1"이(가) 바인딩되지 않았습니다',
  }],
  [re("Operator QQ not supported for QQ"), {
    "zh-TW": '"$2" 不支援運算子 "$1"',
    "zh-CN": '"$2" 不支持运算符 "$1"',
    ja: '演算子 "$1" は "$2" ではサポートされていません',
    ko: '"$2"에는 연산자 "$1"이(가) 지원되지 않습니다',
  }],
  [re("Operator QQ not supported for types QQ and QQ"), {
    "zh-TW": '型別 "$2" 與 "$3" 之間不支援運算子 "$1"',
    "zh-CN": '类型 "$2" 和 "$3" 之间不支持运算符 "$1"',
    ja: '演算子 "$1" は型 "$2" と "$3" の間ではサポートされていません',
    ko: '"$2"과(와) "$3" 형식 사이에는 연산자 "$1"이(가) 지원되지 않습니다',
  }],
  [re("Cannot access attribute QQ for class QQ"), {
    "zh-TW": '無法存取類別 "$2" 的屬性 "$1"',
    "zh-CN": '无法访问类 "$2" 的属性 "$1"',
    ja: 'クラス "$2" の属性 "$1" にアクセスできません',
    ko: '클래스 "$2"의 특성 "$1"에 액세스할 수 없습니다',
  }],
  [re("Attribute QQ is unknown"), {
    "zh-TW": '屬性 "$1" 不存在',
    "zh-CN": '属性 "$1" 未知',
    ja: '属性 "$1" は不明です',
    ko: '특성 "$1"을(를) 알 수 없습니다',
  }],
  [re("QQ is not a known attribute of module QQ"), {
    "zh-TW": '"$1" 不是模組 "$2" 的已知屬性',
    "zh-CN": '"$1" 不是模块 "$2" 的已知属性',
    ja: '"$1" はモジュール "$2" の既知の属性ではありません',
    ko: '"$1"은(는) 모듈 "$2"의 알려진 특성이 아닙니다',
  }],
  [re("QQ is not a known attribute of QQ"), {
    "zh-TW": '"$1" 不是 "$2" 的已知屬性',
    "zh-CN": '"$1" 不是 "$2" 的已知属性',
    ja: '"$1" は "$2" の既知の属性ではありません',
    ko: '"$1"은(는) "$2"의 알려진 특성이 아닙니다',
  }],
  [re("Object of type QQ is not subscriptable"), {
    "zh-TW": '型別為 "$1" 的物件不能使用下標 []',
    "zh-CN": '类型为 "$1" 的对象不可下标 []',
    ja: '型 "$1" のオブジェクトは添字 [] を使用できません',
    ko: '"$1" 형식의 개체는 [] 첨자를 사용할 수 없습니다',
  }],
  [re("Object of type QQ is not callable"), {
    "zh-TW": '型別為 "$1" 的物件不能被呼叫',
    "zh-CN": '类型为 "$1" 的对象不可调用',
    ja: '型 "$1" のオブジェクトは呼び出せません',
    ko: '"$1" 형식의 개체는 호출할 수 없습니다',
  }],
  [re("Object of type QQ cannot be used as iterable value"), {
    "zh-TW": '型別為 "$1" 的物件不能被迭代',
    "zh-CN": '类型为 "$1" 的对象不能作为可迭代值使用',
    ja: '型 "$1" のオブジェクトは反復可能な値として使用できません',
    ko: '"$1" 형식의 개체는 반복 가능한 값으로 사용할 수 없습니다',
  }],
  [re("QQ is not iterable"), {
    "zh-TW": '"$1" 不可迭代',
    "zh-CN": '"$1" 不可迭代',
    ja: '"$1" は反復可能ではありません',
    ko: '"$1"은(는) 반복할 수 없습니다',
  }],
  [re("Cannot instantiate abstract class QQ"), {
    "zh-TW": '無法實例化抽象類別 "$1"',
    "zh-CN": '无法实例化抽象类 "$1"',
    ja: '抽象クラス "$1" はインスタンス化できません',
    ko: '추상 클래스 "$1"을(를) 인스턴스화할 수 없습니다',
  }],
  [re("Method QQ overrides class QQ in an incompatible manner"), {
    "zh-TW": '方法 "$1" 以不相容的方式覆寫了類別 "$2" 的方法',
    "zh-CN": '方法 "$1" 以不兼容的方式重写了类 "$2" 的方法',
    ja: 'メソッド "$1" はクラス "$2" のメソッドを互換性のない方法でオーバーライドしています',
    ko: '메서드 "$1"이(가) 클래스 "$2"의 메서드를 호환되지 않는 방식으로 재정의합니다',
  }],
  [re("Return type mismatch: base method returns type QQ, override returns type QQ"), {
    "zh-TW": '回傳型別不一致：父類別方法回傳 "$1"，覆寫後回傳 "$2"',
    "zh-CN": '返回类型不一致：基类方法返回 "$1"，重写后返回 "$2"',
    ja: '戻り値の型が一致しません: 基底メソッドは "$1"、オーバーライドは "$2" を返します',
    ko: '반환 형식 불일치: 기본 메서드는 "$1", 재정의는 "$2"을(를) 반환합니다',
  }],
  [re("Function with declared return type QQ must return value on all code paths"), {
    "zh-TW": '宣告回傳型別為 "$1" 的函式，必須在所有路徑都回傳值',
    "zh-CN": '声明返回类型为 "$1" 的函数必须在所有代码路径上返回值',
    ja: '戻り値の型が "$1" と宣言された関数は、すべてのコードパスで値を返す必要があります',
    ko: '반환 형식이 "$1"(으)로 선언된 함수는 모든 코드 경로에서 값을 반환해야 합니다',
  }],
  [re("Type parameter QQ is invariant, but QQ is not the same as QQ"), {
    "zh-TW": '型別參數 "$1" 是不變的 (invariant)，但 "$2" 和 "$3" 不是同一個型別',
    "zh-CN": '类型参数 "$1" 是不变的 (invariant)，但 "$2" 与 "$3" 不是同一类型',
    ja: '型パラメーター "$1" は不変 (invariant) ですが、"$2" と "$3" は同じ型ではありません',
    ko: '형식 매개변수 "$1"은(는) 불변(invariant)이지만 "$2"과(와) "$3"은(는) 같은 형식이 아닙니다',
  }],
  [re("Type parameter QQ is covariant, but QQ is not a subtype of QQ"), {
    "zh-TW": '型別參數 "$1" 是協變的 (covariant)，但 "$2" 不是 "$3" 的子型別',
    "zh-CN": '类型参数 "$1" 是协变的 (covariant)，但 "$2" 不是 "$3" 的子类型',
    ja: '型パラメーター "$1" は共変 (covariant) ですが、"$2" は "$3" のサブタイプではありません',
    ko: '형식 매개변수 "$1"은(는) 공변(covariant)이지만 "$2"은(는) "$3"의 하위 형식이 아닙니다',
  }],
  [re("Consider switching from QQ to QQ which is covariant"), {
    "zh-TW": '可以考慮把 "$1" 換成協變的 "$2"',
    "zh-CN": '可以考虑将 "$1" 换成协变的 "$2"',
    ja: '"$1" を共変の "$2" に切り替えることを検討してください',
    ko: '"$1"을(를) 공변인 "$2"(으)로 바꾸는 것을 고려하세요',
  }],
  [re("Consider switching from QQ to QQ which is covariant in the value type"), {
    "zh-TW": '可以考慮把 "$1" 換成值型別協變的 "$2"',
    "zh-CN": '可以考虑将 "$1" 换成值类型协变的 "$2"',
    ja: '"$1" を、値の型が共変である "$2" に切り替えることを検討してください',
    ko: '"$1"을(를) 값 형식이 공변인 "$2"(으)로 바꾸는 것을 고려하세요',
  }],
  [re("Consider switching from QQ to QQ which is covariant in the key type"), {
    "zh-TW": '可以考慮把 "$1" 換成鍵型別協變的 "$2"',
    "zh-CN": '可以考虑将 "$1" 换成键类型协变的 "$2"',
    ja: '"$1" を、キーの型が共変である "$2" に切り替えることを検討してください',
    ko: '"$1"을(를) 키 형식이 공변인 "$2"(으)로 바꾸는 것을 고려하세요',
  }],
  [re("Code is unreachable"), {
    "zh-TW": "這段程式碼永遠不會被執行",
    "zh-CN": "这段代码永远不会被执行",
    ja: "このコードには到達できません",
    ko: "이 코드에는 도달할 수 없습니다",
  }],
  [re("Expression value is unused"), {
    "zh-TW": "運算式的結果沒有被使用",
    "zh-CN": "表达式的值未被使用",
    ja: "式の値が使用されていません",
    ko: "식의 값이 사용되지 않습니다",
  }],
  [re("QQ is not accessed"), {
    "zh-TW": '"$1" 沒有被使用',
    "zh-CN": '"$1" 未被使用',
    ja: '"$1" は使用されていません',
    ko: '"$1"이(가) 사용되지 않습니다',
  }],

  // ---------------------------------------------------------------- mypy
  [re("Argument (\\d+) to QQ has incompatible type QQ; expected QQ"), {
    "zh-TW": '傳給 "$2" 的第 $1 個引數型別不相容：得到 "$3"，預期 "$4"',
    "zh-CN": '传给 "$2" 的第 $1 个实参类型不兼容：得到 "$3"，应为 "$4"',
    ja: '"$2" の第 $1 引数の型に互換性がありません: "$3" ですが、"$4" が必要です',
    ko: '"$2"의 $1번째 인수 형식이 호환되지 않습니다: "$3"이지만 "$4"이(가) 필요합니다',
  }],
  [re("Argument QQ to QQ has incompatible type QQ; expected QQ"), {
    "zh-TW": '傳給 "$2" 的引數 "$1" 型別不相容：得到 "$3"，預期 "$4"',
    "zh-CN": '传给 "$2" 的实参 "$1" 类型不兼容：得到 "$3"，应为 "$4"',
    ja: '"$2" の引数 "$1" の型に互換性がありません: "$3" ですが、"$4" が必要です',
    ko: '"$2"의 인수 "$1" 형식이 호환되지 않습니다: "$3"이지만 "$4"이(가) 필요합니다',
  }],
  [re("Incompatible types in assignment \\(expression has type QQ, variable has type QQ\\)"), {
    "zh-TW": '賦值型別不相容（運算式型別 "$1"，變數型別 "$2"）',
    "zh-CN": '赋值类型不兼容（表达式类型 "$1"，变量类型 "$2"）',
    ja: '代入の型に互換性がありません（式の型は "$1"、変数の型は "$2"）',
    ko: '할당 형식이 호환되지 않습니다(식 형식 "$1", 변수 형식 "$2")',
  }],
  [re("Incompatible return value type \\(got QQ, expected QQ\\)"), {
    "zh-TW": '回傳值型別不相容（得到 "$1"，預期 "$2"）',
    "zh-CN": '返回值类型不兼容（得到 "$1"，应为 "$2"）',
    ja: '戻り値の型に互換性がありません（"$1" ですが、"$2" が必要です）',
    ko: '반환 값 형식이 호환되지 않습니다("$1"이지만 "$2"이(가) 필요합니다)',
  }],
  [re("Incompatible types \\(expression has type QQ, TypedDict item QQ has type QQ\\)"), {
    "zh-TW": '型別不相容（運算式型別 "$1"，TypedDict 欄位 "$2" 的型別是 "$3"）',
    "zh-CN": '类型不兼容（表达式类型 "$1"，TypedDict 项 "$2" 的类型是 "$3"）',
    ja: '型に互換性がありません（式の型は "$1"、TypedDict の項目 "$2" の型は "$3"）',
    ko: '형식이 호환되지 않습니다(식 형식 "$1", TypedDict 항목 "$2"의 형식 "$3")',
  }],
  [re("List item (\\d+) has incompatible type QQ; expected QQ"), {
    "zh-TW": '串列第 $1 個元素型別不相容：得到 "$2"，預期 "$3"',
    "zh-CN": '列表第 $1 项类型不兼容：得到 "$2"，应为 "$3"',
    ja: 'リストの要素 $1 の型に互換性がありません: "$2" ですが、"$3" が必要です',
    ko: '리스트 항목 $1의 형식이 호환되지 않습니다: "$2"이지만 "$3"이(가) 필요합니다',
  }],
  [re("Name QQ is not defined"), {
    "zh-TW": '名稱 "$1" 尚未定義',
    "zh-CN": '名称 "$1" 未定义',
    ja: '名前 "$1" は定義されていません',
    ko: '이름 "$1"이(가) 정의되지 않았습니다',
  }],
  [re("Item QQ of QQ has no attribute QQ"), {
    "zh-TW": '"$2" 中的 "$1" 沒有屬性 "$3"',
    "zh-CN": '"$2" 中的 "$1" 没有属性 "$3"',
    ja: '"$2" の要素 "$1" に属性 "$3" はありません',
    ko: '"$2"의 항목 "$1"에 특성 "$3"이(가) 없습니다',
  }],
  [re("Module QQ has no attribute QQ"), {
    "zh-TW": '模組 "$1" 沒有屬性 "$2"',
    "zh-CN": '模块 "$1" 没有属性 "$2"',
    ja: 'モジュール "$1" に属性 "$2" はありません',
    ko: '모듈 "$1"에 특성 "$2"이(가) 없습니다',
  }],
  [re("QQ has no attribute QQ"), {
    "zh-TW": '"$1" 沒有屬性 "$2"',
    "zh-CN": '"$1" 没有属性 "$2"',
    ja: '"$1" に属性 "$2" はありません',
    ko: '"$1"에 특성 "$2"이(가) 없습니다',
  }],
  [re("Cannot find implementation or library stub for module named QQ"), {
    "zh-TW": '找不到模組 "$1" 的實作或型別存根 (stub)',
    "zh-CN": '找不到模块 "$1" 的实现或类型存根 (stub)',
    ja: 'モジュール "$1" の実装またはライブラリスタブが見つかりません',
    ko: '모듈 "$1"의 구현 또는 라이브러리 스텁을 찾을 수 없습니다',
  }],
  [re("Library stubs not installed for QQ"), {
    "zh-TW": '尚未安裝 "$1" 的型別存根 (stub)',
    "zh-CN": '未安装 "$1" 的类型存根 (stub)',
    ja: '"$1" のライブラリスタブがインストールされていません',
    ko: '"$1"의 라이브러리 스텁이 설치되지 않았습니다',
  }],
  [re("Unsupported operand types for (\\S+) \\(QQ and QQ\\)"), {
    "zh-TW": '運算子 $1 不支援 "$2" 與 "$3" 這兩種型別',
    "zh-CN": '运算符 $1 不支持 "$2" 和 "$3" 这两种类型',
    ja: '演算子 $1 は "$2" と "$3" の組み合わせをサポートしていません',
    ko: '연산자 $1은(는) "$2"과(와) "$3" 형식을 지원하지 않습니다',
  }],
  [re("Unsupported left operand type for (\\S+) \\(QQ\\)"), {
    "zh-TW": '運算子 $1 不支援左側型別 "$2"',
    "zh-CN": '运算符 $1 不支持左操作数类型 "$2"',
    ja: '演算子 $1 は左オペランドの型 "$2" をサポートしていません',
    ko: '연산자 $1은(는) 왼쪽 피연산자 형식 "$2"을(를) 지원하지 않습니다',
  }],
  [re("Left operand is of type QQ"), {
    "zh-TW": '左側運算元的型別是 "$1"',
    "zh-CN": '左操作数的类型是 "$1"',
    ja: '左オペランドの型は "$1" です',
    ko: '왼쪽 피연산자의 형식은 "$1"입니다',
  }],
  [re("Missing return statement"), {
    "zh-TW": "缺少 return 陳述式",
    "zh-CN": "缺少 return 语句",
    ja: "return 文がありません",
    ko: "return 문이 없습니다",
  }],
  [re("Cannot infer type of lambda"), {
    "zh-TW": "無法推斷 lambda 的型別",
    "zh-CN": "无法推断 lambda 的类型",
    ja: "lambda の型を推論できません",
    ko: "lambda의 형식을 유추할 수 없습니다",
  }],
  [re("Need type annotation for QQ(.*)"), {
    "zh-TW": '"$1" 需要型別註記$2',
    "zh-CN": '"$1" 需要类型注解$2',
    ja: '"$1" には型注釈が必要です$2',
    ko: '"$1"에 형식 주석이 필요합니다$2',
  }],
  [re("Too few arguments for QQ"), {
    "zh-TW": '呼叫 "$1" 的引數太少',
    "zh-CN": '调用 "$1" 的实参太少',
    ja: '"$1" の引数が少なすぎます',
    ko: '"$1"에 대한 인수가 너무 적습니다',
  }],
  [re("Too many arguments for QQ"), {
    "zh-TW": '呼叫 "$1" 的引數太多',
    "zh-CN": '调用 "$1" 的实参太多',
    ja: '"$1" の引数が多すぎます',
    ko: '"$1"에 대한 인수가 너무 많습니다',
  }],
  [re("Unexpected keyword argument QQ for QQ"), {
    "zh-TW": '"$2" 沒有關鍵字參數 "$1"',
    "zh-CN": '"$2" 没有关键字参数 "$1"',
    ja: '"$2" に予期しないキーワード引数 "$1" があります',
    ko: '"$2"에 예상치 못한 키워드 인수 "$1"이(가) 있습니다',
  }],
  [re("Following member\\(s\\) of QQ have conflicts:"), {
    "zh-TW": '"$1" 的下列成員有衝突：',
    "zh-CN": '"$1" 的下列成员存在冲突：',
    ja: '"$1" の次のメンバーが競合しています:',
    ko: '"$1"의 다음 멤버가 충돌합니다:',
  }],
  [re("Expected:"), { "zh-TW": "預期：", "zh-CN": "应为：", ja: "期待値:", ko: "예상:" }],
  [re("Got:"), { "zh-TW": "實際：", "zh-CN": "实际：", ja: "実際:", ko: "실제:" }],
];

/** Number of message patterns translated for every non-English locale. */
export const PATTERN_COUNT = PATTERNS.length;

/** Translates one line (without leading indentation). Unknown lines are returned unchanged. */
export function translateLine(line: string, locale: Locale): string {
  if (locale === "en") return line;
  for (const [pattern, translations] of PATTERNS) {
    if (pattern.test(line)) return line.replace(pattern, translations[locale]);
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

/**
 * Maps a setting value or UI language (e.g. VS Code's `vscode.env.language`,
 * or `zh_TW` from `$LANG`) to a supported locale.
 */
export function resolveLocale(setting: string | undefined, uiLanguage: string | undefined): Locale {
  const value = (setting && setting !== "auto" ? setting : uiLanguage ?? "en").toLowerCase().replace(/_/g, "-");
  if (value.startsWith("zh")) {
    if (/^zh-(tw|hk|mo|hant)/.test(value)) return "zh-TW";
    return "zh-CN";
  }
  if (value === "ja" || value.startsWith("ja-")) return "ja";
  if (value === "ko" || value.startsWith("ko-")) return "ko";
  return "en";
}
