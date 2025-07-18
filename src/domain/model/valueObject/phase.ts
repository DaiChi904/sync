import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("Phase");

export type Phase = Brand<number, typeof brandSymbol>;

export namespace Phase {
  export const from = (value: number): Phase => {
    return value as Phase;
  };

  export const unBrand = (value: Phase): number => {
    return value as unknown as number;
  };
}
