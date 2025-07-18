import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("EvalResult");

export type EvalResult = Brand<boolean, typeof brandSymbol>;

export namespace EvalResult {
  export const from = (value: boolean): EvalResult => {
    return value as EvalResult;
  };

  export const unBrand = (value: EvalResult): boolean => {
    return value as unknown as boolean;
  };
}
