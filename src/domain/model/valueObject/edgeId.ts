import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("EdgeId");

export type EdgeId = Brand<string, typeof brandSymbol>;

export namespace EdgeId {
  export const from = (value: string): EdgeId => {
    return value as EdgeId;
  };

  export const unBrand = (value: EdgeId): string => {
    return value as unknown as string;
  };
}
