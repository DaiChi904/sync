import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitNodeId");

export type CircuitNodeId = Brand<string, typeof brandSymbol>;

export namespace CircuitNodeId {
  export const from = (value: string): CircuitNodeId => {
    return value as CircuitNodeId;
  };

  export const unBrand = (value: CircuitNodeId): string => {
    return value as unknown as string;
  };
}
