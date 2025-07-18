import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("ExecutionOrder");

export type ExecutionOrder = Brand<number, typeof brandSymbol>;

export namespace ExecutionOrder {
  export const from = (value: number): ExecutionOrder => {
    return value as ExecutionOrder;
  };

  export const unBrand = (value: ExecutionOrder): number => {
    return value as unknown as number;
  };
}
