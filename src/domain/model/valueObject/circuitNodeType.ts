import { Attempt } from "@/utils/attempt";
import type { Brand } from "@/utils/brand";

const brandSymbol = Symbol("CircuitNodeType");

type ICircuitNodeType = "ENTRY" | "EXIT" | "AND" | "OR" | "NOT" | "JUNCTION";

export type CircuitNodeType = Brand<ICircuitNodeType, typeof brandSymbol>;

export namespace CircuitNodeType {
  export const from = (value: string): CircuitNodeType => {
    if (!["ENTRY", "EXIT", "AND", "OR", "NOT", "JUNCTION"].includes(value)) {
      throw new Attempt.ModelValidationError("CircuitNodeType", value);
    }

    return value as CircuitNodeType;
  };

  export const unBrand = (value: CircuitNodeType): ICircuitNodeType => {
    return value as unknown as ICircuitNodeType;
  };
}
