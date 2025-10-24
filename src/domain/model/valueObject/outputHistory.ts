import type { Brand } from "@/utils/brand";
import type { OutputRecord } from "./outputRecord.ts";
import type { Tick } from "./tick";

const brandSymbol = Symbol("OutputHistory");

type IOutputHistory = Map<Tick, OutputRecord>;

export type OutputHistory = Brand<IOutputHistory, typeof brandSymbol>;

export namespace OutputHistory {
  export const from = (value: IOutputHistory): OutputHistory => {
    return value as OutputHistory;
  };

  export const unBrand = (value: OutputHistory): IOutputHistory => {
    return value as unknown as IOutputHistory;
  };
}
