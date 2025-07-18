import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitGuiData } from "../entity/circuitGuiData";

export interface ICircuitParserService {
  parseToGuiData(textData: string): Result<CircuitGuiData>;
  parseToGraphData(textData: string): Result<CircuitGraphData>;
}
