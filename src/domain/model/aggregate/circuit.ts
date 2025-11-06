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

  export const changeTitle = (circuit: Circuit, title: CircuitTitle): Circuit => {
    return Circuit.from({
      ...circuit,
      title,
    });
  };

  export const changeDescription = (circuit: Circuit, description: CircuitDescription): Circuit => {
    return Circuit.from({
      ...circuit,
      description,
    });
  };

  export const changeCircuitData = (circuit: Circuit, circuitData: CircuitData): Circuit => {
    return Circuit.from({
      ...circuit,
      circuitData,
    });
  };

  export const changeUpdatedAt = (circuit: Circuit, updatedAt: UpdatedDateTime): Circuit => {
    return Circuit.from({
      ...circuit,
      updatedAt,
    });
  };
}
