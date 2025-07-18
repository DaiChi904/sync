import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitEdgeId");

export type CircuitEdgeId = Brand<string, typeof brandSymbol>;

export namespace CircuitEdgeId {
  export const from = (value: string): CircuitEdgeId => {
    return value as CircuitEdgeId;
  };

  export const unBrand = (value: CircuitEdgeId): string => {
    return value as unknown as string;
  };
}
