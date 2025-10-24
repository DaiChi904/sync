import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("EvalDuration");

export type EvalDuration = Brand<number, typeof brandSymbol>;

export namespace EvalDuration {
  export const from = (value: number): EvalDuration => {
    return value as EvalDuration;
  };

  export const unBrand = (value: EvalDuration): number => {
    return value as unknown as number;
  };
}
