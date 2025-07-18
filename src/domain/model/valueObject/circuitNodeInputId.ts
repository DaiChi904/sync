import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitNodeInputId");

export type CircuitNodeInputId = Brand<string, typeof brandSymbol>;

export namespace CircuitNodeInputId {
  export const from = (value: string): CircuitNodeInputId => {
    return value as CircuitNodeInputId;
  };

  export const unBrand = (value: CircuitNodeInputId): string => {
    return value as unknown as string;
  };
}
