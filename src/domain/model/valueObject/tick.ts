import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("Tick");

export type Tick = Brand<number, typeof brandSymbol>;

export namespace Tick {
  export const from = (value: number): Tick => {
    return value as Tick;
  };

  export const unBrand = (value: Tick): number => {
    return value as unknown as number;
  };
}
