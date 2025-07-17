import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitId");

export type CircuitId = Brand<string, typeof brandSymbol>;

export namespace CircuitId {
  export const from = (value: string): CircuitId => {
    return value as CircuitId;
  };

  export const unBrand = (value: CircuitId): string => {
    return value as unknown as string;
  };
}
