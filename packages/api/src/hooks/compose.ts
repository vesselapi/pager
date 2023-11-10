export const compose = <T,U>(fn1: (a: T) => U, ...fns: Array<(a: T) => >) =>
  fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1);
