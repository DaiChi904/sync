import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitTitle");

export type CircuitTitle = Brand<string, typeof brandSymbol>;

export namespace CircuitTitle {
  export const from = (value: string): CircuitTitle => {
    return value as CircuitTitle;
  };

  export const unBrand = (value: CircuitTitle): string => {
    return value as unknown as string;
  };
}
