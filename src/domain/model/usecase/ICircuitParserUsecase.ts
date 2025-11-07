import type { Result } from "@/utils/result";
import type { CircuitDataParseError } from "../service/ICircuitParserService";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitData } from "../valueObject/circuitData";
import type { CircuitGraphData } from "../valueObject/circuitGraphData";
import type { CircuitGuiData } from "../valueObject/circuitGuiData";

export interface ICircuitParserUsecase {
  parseToGuiData(textData: CircuitData): Result<CircuitGuiData, CircuitDataParseError | UnexpectedError>;
  parseToGraphData(textData: CircuitData): Result<CircuitGraphData, CircuitDataParseError | UnexpectedError>;
}
