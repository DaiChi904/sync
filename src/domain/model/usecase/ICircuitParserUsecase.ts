import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitData } from "../valueObject/circuitData";

export type ICircuitParserUsecaseParseToGuiDataOutput = Result<Readonly<CircuitGuiData>>;

export type ICircuitParserUsecaseParseToGraphDataOutput = Result<Readonly<CircuitGraphData>>;

export interface ICircuitParserUsecase {
  parseToGuiData(textData: CircuitData): ICircuitParserUsecaseParseToGuiDataOutput;
  parseToGraphData(textData: CircuitData): ICircuitParserUsecaseParseToGraphDataOutput;
}
