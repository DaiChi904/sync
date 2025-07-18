import type { Brand } from "@/utils/brand";
import { ModelValidationError } from "../modelValidationError";

const brandSymbol = Symbol("CircuitNodeType");

type ICircuitNodeType = "ENTRY" | "EXIT" | "AND" | "OR" | "NOT" | "JUNCTION";

export type CircuitNodeType = Brand<ICircuitNodeType, typeof brandSymbol>;

export namespace CircuitNodeType {
  export const from = (value: string): CircuitNodeType => {
    if (!["ENTRY", "EXIT", "AND", "OR", "NOT", "JUNCTION"].includes(value))
      throw new ModelValidationError("CircuitNodeType", value);
    return value as CircuitNodeType;
  };

  export const unBrand = (value: CircuitNodeType): ICircuitNodeType => {
    return value as unknown as ICircuitNodeType;
  };
}
