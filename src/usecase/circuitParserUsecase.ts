import type { CircuitDataParseError, ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { ICircuitParserUsecase } from "@/domain/model/usecase/ICircuitParserUsecase";
import type { CircuitData } from "@/domain/model/valueObject/circuitData";
import type { CircuitGraphData } from "@/domain/model/valueObject/circuitGraphData";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { Result } from "@/utils/result";

interface CircuitParserUsecaseDependencies {
  circuitParserService: ICircuitParserService;
}

export class CircuitParserUsecase implements ICircuitParserUsecase {
  private readonly circuitParserService: ICircuitParserService;

  constructor({ circuitParserService }: CircuitParserUsecaseDependencies) {
    this.circuitParserService = circuitParserService;
  }

  parseToGuiData(circuitData: CircuitData): Result<CircuitGuiData, CircuitDataParseError | UnexpectedError> {
    return this.circuitParserService.parseToGuiData(circuitData);
  }

  parseToGraphData(circuitData: CircuitData): Result<CircuitGraphData, CircuitDataParseError | UnexpectedError> {
    return this.circuitParserService.parseToGraphData(circuitData);
  }
}
