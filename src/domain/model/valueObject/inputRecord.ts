import type { Brand } from "@/utils/brand";
import type { CircuitNodeInputId } from "./circuitNodeInputId";
import type { EvalResult } from "./evalResult";

const brandSymbol = Symbol("InputRecord");

type IInputRecord = Record<CircuitNodeInputId, EvalResult>;

export type InputRecord = Brand<IInputRecord, typeof brandSymbol>;

export namespace InputRecord {
  export const from = (value: IInputRecord): InputRecord => {
    return value as InputRecord;
  };

  export const unBrand = (value: InputRecord): IInputRecord => {
    return value as unknown as IInputRecord;
  };
}
