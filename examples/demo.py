from typing import Callable, TypedDict


class Order(TypedDict):
    id: int
    items: list[tuple[str, int]]
    shipping: dict[str, str] | None


Handler = Callable[[Order, dict[str, list[int]]], bool]


def process(orders: dict[str, list[Order]], on_done: Handler) -> None: ...


def notify(order: Order, meta: dict[str, list[str]]) -> bool:
    return True


raw = {"tw": [{"id": 1, "items": [("tea", "2")], "shipping": None}]}
process(raw, notify)
