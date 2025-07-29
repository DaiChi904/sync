import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type {
  ICircuitParserUsecase,
  ICircuitParserUsecaseParseToGraphDataOutput,
  ICircuitParserUsecaseParseToGuiDataOutput,
} from "@/domain/model/usecase/ICircuitParserUsecase";
import type { CircuitData } from "@/domain/model/valueObject/circuitData";

export class CircuitParserUsecaseError extends Error {
  constructor(message: string, options: { cause: unknown }) {
    super(message);
    this.name = "CircuitParserUsecaseError";
    this.cause = options.cause;
  }
}

interface CircuitParserUsecaseDependencies {
  circuitParserService: ICircuitParserService;
}

export class CircuitParserUsecase implements ICircuitParserUsecase {
  private readonly circuitParserService: ICircuitParserService;

  constructor({ circuitParserService }: CircuitParserUsecaseDependencies) {
    this.circuitParserService = circuitParserService;
  }

  parseToGuiData(circuitData: CircuitData): ICircuitParserUsecaseParseToGuiDataOutput {
    const res = this.circuitParserService.parseToGuiData(circuitData);
    if (!res.ok) {
      return {
        ok: false,
        error: new CircuitParserUsecaseError("Failed to parse circuit data to gui data.", { cause: res.error }),
      };
    }

    return res;
  }

  parseToGraphData(circuitData: CircuitData): ICircuitParserUsecaseParseToGraphDataOutput {
    const res = this.circuitParserService.parseToGraphData(circuitData);
    if (!res.ok) {
      return {
        ok: false,
        error: new CircuitParserUsecaseError("Failed to parse circuit data to graph data.", { cause: res.error }),
      };
    }

    return res;
  }
}
