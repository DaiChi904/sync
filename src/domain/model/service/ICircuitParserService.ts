import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitData } from "../valueObject/circuitData";

export interface ICircuitParserService {
  parseToGuiData(circuitData: CircuitData): Result<CircuitGuiData>;
  parseToGraphData(circuitData: CircuitData): Result<CircuitGraphData>;
}
