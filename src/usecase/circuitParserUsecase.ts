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

    switch (res.ok) {
      case true: {
        return { ok: true, value: res.value };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }

  parseToGraphData(circuitData: CircuitData): ICircuitParserUsecaseParseToGraphDataOutput {
    const res = this.circuitParserService.parseToGraphData(circuitData);

    switch (res.ok) {
      case true: {
        return { ok: true, value: res.value };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }
}
