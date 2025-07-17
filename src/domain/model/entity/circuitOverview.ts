import type { Brand } from "@/utils/brand";
import type { CircuitDescription } from "../valueObject/circuitDescription";
import type { CircuitId } from "../valueObject/circuitId";
import type { CircuitTitle } from "../valueObject/circuitTitle";
import type { CreatedDateTime } from "../valueObject/createdDateTime";
import type { UpdatedDateTime } from "../valueObject/updatedDateTime";

const brandSymbol = Symbol("CircuitOverview");

interface ICircuitOverview {
  id: CircuitId;
  title: CircuitTitle;
  description: CircuitDescription;
  createdAt: CreatedDateTime;
  updatedAt: UpdatedDateTime;
}

export type CircuitOverview = Brand<ICircuitOverview, typeof brandSymbol>;

export namespace CircuitOverview {
  export const from = (value: ICircuitOverview): CircuitOverview => {
    return value as CircuitOverview;
  };

  export const unBrand = (value: CircuitOverview): ICircuitOverview => {
    return value as unknown as CircuitOverview;
  };
}
