from typing import TypedDict, Callable, Literal, Protocol

class User(TypedDict):
    id: int
    name: str
    tags: list[str]

def greet(user: User, formatter: Callable[[str, int], str]) -> str:
    return formatter(user["name"], user["id"])

greet({"id": "1", "name": "a", "tags": []}, lambda s: s)

def f(x: dict[str, list[tuple[int, str]]]) -> None: ...
f({"a": [(1, 2)]})

Mode = Literal["r", "w", "a"]
def op(m: Mode) -> None: ...
op("x")

class Greeter(Protocol):
    def greet(self, name: str) -> str: ...
class Bad:
    def greet(self, name: int) -> str: return ""
g: Greeter = Bad()

x: int = "hello"
import nonexistent_mod
y = undefined_name
def h(a: int | None):
    return a + 1
class A: pass
A().missing
