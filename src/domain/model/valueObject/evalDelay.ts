import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("EvalDelay");

export type EvalDelay = Brand<number, typeof brandSymbol>;

export namespace EvalDelay {
  export const from = (value: number): EvalDelay => {
    return value as EvalDelay;
  };

  export const unBrand = (value: EvalDelay): number => {
    return value as unknown as number;
  };
}
