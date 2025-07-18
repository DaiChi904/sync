import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitNodeOutputId");

export type CircuitNodeOutputId = Brand<string, typeof brandSymbol>;

export namespace CircuitNodeOutputId {
  export const from = (value: string): CircuitNodeOutputId => {
    return value as CircuitNodeOutputId;
  };

  export const unBrand = (value: CircuitNodeOutputId): string => {
    return value as unknown as string;
  };
}
