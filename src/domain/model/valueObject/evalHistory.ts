import type { Brand } from "@/utils/brand";
import type { EvalResult } from "./evalResult";
import type { Phase } from "./phase";
import type { Tick } from "./tick";

const brandSymbol = Symbol("EvalHistory");

type IEvalHistory = Map<Phase, Map<Tick, EvalResult>>;

export type EvalHistory = Brand<IEvalHistory, typeof brandSymbol>;

export namespace EvalHistory {
  export const from = (value: IEvalHistory): EvalHistory => {
    return value as EvalHistory;
  };

  export const unBrand = (value: EvalHistory): IEvalHistory => {
    return value as unknown as IEvalHistory;
  };
}
