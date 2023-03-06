
// Provides a typed implementation of Source lists

export type Pair<H, T> = [H, T];
export type List<T> = null | [T, List<T>];

export function pair<H, T>(hd: H, tl: T): Pair<H, T> {
	return [hd, tl];
}

export function head<H, T>(p: Pair<H, T>): H {
	return p[0];
}

export function tail<H, T>(p: Pair<H, T>): T {
	return p[1];
}

export function set_head<H, T>(p: Pair<H, T>, val: H): void {
	p[0] = val;
}

export function set_tail<H, T>(p: Pair<H, T>, val: T): void {
	p[1] = val;
}

export function is_null(v: any): v is null {
	return v === null;
}

export function list<S>(...elements: Array<S>): List<S> {
  let lst: List<S> = null
  for (let i = elements.length - 1; i >= 0; i -= 1) {
    lst = pair(elements[i], lst);
  }
  return lst;
}

export function append<S>(xs: List<S>, ys: List<S>): List<S> {
  return is_null(xs) ? ys : pair(head(xs), append(tail(xs), ys));
}
