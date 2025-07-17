export type Brand<T, brandSymbol extends symbol> = T & {
  readonly [key in brandSymbol]: unknown;
};
