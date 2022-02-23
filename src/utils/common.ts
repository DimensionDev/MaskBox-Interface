export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function tenify(num: number) {
  return Math.abs(num) > 9 ? num : `0${num}`;
}

export function arrayRemove<T>(arr: T[], item: T): T[] {
  const idx = arr.indexOf(item);
  return arr.splice(idx, 1);
}

export type DeferTuple<T extends any = any, E extends unknown = unknown> = [
  Promise<T>,
  (value: T | PromiseLike<T>) => void,
  (reason?: E) => void,
];

export function createDefer<T extends any = any, E extends unknown = unknown>(): DeferTuple<T, E> {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: E) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return [promise, resolve!, reject!];
}

export const EMPTY_LIST: never[] = Object.freeze([]) as never[];

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function unreachable(value: never): never {
  console.error('Unhandled value: ', value);
  throw new Error('Unreachable case:' + value);
}
