import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitNodeSize");

interface ICircuitNodeSize {
  x: number;
  y: number;
}

export type CircuitNodeSize = Brand<ICircuitNodeSize, typeof brandSymbol>;

export namespace CircuitNodeSize {
  export const from = (value: ICircuitNodeSize): CircuitNodeSize => {
    return value as CircuitNodeSize;
  };

  export const unBrand = (value: CircuitNodeSize): ICircuitNodeSize => {
    return value as unknown as ICircuitNodeSize;
  };
}
