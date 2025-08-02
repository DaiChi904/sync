import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type {
  ICircuitParserUsecase,
  ICircuitParserUsecaseParseToGraphDataOutput,
  ICircuitParserUsecaseParseToGuiDataOutput,
} from "@/domain/model/usecase/ICircuitParserUsecase";
import type { CircuitData } from "@/domain/model/valueObject/circuitData";

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
      return { ok: false, error: res.error };
    }

    return { ok: true, value: res.value };
  }

  parseToGraphData(circuitData: CircuitData): ICircuitParserUsecaseParseToGraphDataOutput {
    const res = this.circuitParserService.parseToGraphData(circuitData);
    if (!res.ok) {
      return { ok: false, error: res.error };
    }

    return { ok: true, value: res.value };
  }
}
