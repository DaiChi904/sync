import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitDataParseError } from "../service/ICircuitParserService";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitData } from "../valueObject/circuitData";

export interface ICircuitParserUsecase {
  parseToGuiData(textData: CircuitData): Result<CircuitGuiData, CircuitDataParseError | UnexpectedError>;
  parseToGraphData(textData: CircuitData): Result<CircuitGraphData, CircuitDataParseError | UnexpectedError>;
}
