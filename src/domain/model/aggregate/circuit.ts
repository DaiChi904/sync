import type { Brand } from "@/utils/brand";
import type { CircuitData } from "../valueObject/circuitData";
import type { CircuitDescription } from "../valueObject/circuitDescription";
import type { CircuitId } from "../valueObject/circuitId";
import type { CircuitTitle } from "../valueObject/circuitTitle";
import type { CreatedDateTime } from "../valueObject/createdDateTime";
import type { UpdatedDateTime } from "../valueObject/updatedDateTime";

const brandSymbol = Symbol("Circuit");

interface ICircuit {
  id: CircuitId;
  title: CircuitTitle;
  description: CircuitDescription;
  circuitData: CircuitData;
  createdAt: CreatedDateTime;
  updatedAt: UpdatedDateTime;
}

export type Circuit = Brand<ICircuit, typeof brandSymbol>;

export namespace Circuit {
  export const from = (value: ICircuit): Circuit => {
    return value as Circuit;
  };

  export const unBrand = (value: Circuit): ICircuit => {
    return value as unknown as ICircuit;
  };
}
