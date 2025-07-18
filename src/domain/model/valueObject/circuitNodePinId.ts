import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitNodePinId");

export type CircuitNodePinId = Brand<string, typeof brandSymbol>;

export namespace CircuitNodePinId {
  export const from = (value: string): CircuitNodePinId => {
    return value as CircuitNodePinId;
  };

  export const unBrand = (value: CircuitNodePinId): string => {
    return value as unknown as string;
  };
}
