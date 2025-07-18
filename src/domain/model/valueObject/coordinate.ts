import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("Coordinate");

interface ICoordinate {
  x: number;
  y: number;
}

export type Coordinate = Brand<ICoordinate, typeof brandSymbol>;

export namespace Coordinate {
  export const from = (value: ICoordinate): Coordinate => {
    return value as Coordinate;
  };

  export const unBrand = (value: Coordinate): ICoordinate => {
    return value as unknown as ICoordinate;
  };
}
