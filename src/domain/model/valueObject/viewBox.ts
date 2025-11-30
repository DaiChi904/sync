import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("ViewBox");

export interface IViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type ViewBox = Brand<IViewBox, typeof brandSymbol>;

export namespace ViewBox {
  export const from = (value: IViewBox): ViewBox => {
    return value as ViewBox;
  };

  export const unBrand = (value: ViewBox): IViewBox => {
    return value as unknown as IViewBox;
  };

  export const toHtmlFormat = (viewBox: ViewBox): string => {
    return `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;
  };
}
