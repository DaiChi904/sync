import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitDescription");

export type CircuitDescription = Brand<string, typeof brandSymbol>;

export namespace CircuitDescription {
  export const from = (value: string): CircuitDescription => {
    return value as CircuitDescription;
  };

  export const unBrand = (value: CircuitDescription): string => {
    return value as unknown as string;
  };
}
