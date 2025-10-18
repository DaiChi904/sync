import type { Brand } from "@/utils/brand";
import type { CircuitNodeId } from "./circuitNodeId";
import type { EvalResult } from "./evalResult";

const brandSymbol = Symbol("OutputRecord");

type IOutputRecord = Record<CircuitNodeId, EvalResult>;

export type OutputRecord = Brand<IOutputRecord, typeof brandSymbol>;

export namespace OutputRecord {
  export const from = (value: IOutputRecord): OutputRecord => {
    return value as OutputRecord;
  };

  export const unBrand = (value: OutputRecord): IOutputRecord => {
    return value as unknown as IOutputRecord;
  };
}
