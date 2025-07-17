import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitData");

/**
 * !Caution: CircuitData is defined as string.
 */
export type CircuitData = Brand<string, typeof brandSymbol>;

export namespace CircuitData {
  export const from = (value: string): CircuitData => {
    return value as CircuitData;
  };

  export const unBrand = (value: CircuitData): string => {
    return value as unknown as string;
  };
}
