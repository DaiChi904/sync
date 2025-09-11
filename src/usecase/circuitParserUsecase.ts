import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import { CircuitParserUsecaseError, type ICircuitParserUsecase } from "@/domain/model/usecase/ICircuitParserUsecase";
import type { CircuitData } from "@/domain/model/valueObject/circuitData";
import type { Result } from "@/utils/result";

interface CircuitParserUsecaseDependencies {
  circuitParserService: ICircuitParserService;
}

export class CircuitParserUsecase implements ICircuitParserUsecase {
  private readonly circuitParserService: ICircuitParserService;

  constructor({ circuitParserService }: CircuitParserUsecaseDependencies) {
    this.circuitParserService = circuitParserService;
  }

  parseToGuiData(circuitData: CircuitData): Result<CircuitGuiData, CircuitParserUsecaseError> {
    try {
      const res = this.circuitParserService.parseToGuiData(circuitData);
      if (!res.ok) {
        throw new CircuitParserUsecaseError("Failed to parse circuit data.", {
          cause: res.error,
        });
      }

      return { ok: true, value: res.value };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitParserUsecaseError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitParserUsecaseError("Unknown error occurred while parsing circuit data.", { cause: err }),
      };
    }
  }

  parseToGraphData(circuitData: CircuitData): Result<CircuitGraphData, CircuitParserUsecaseError> {
    try {
      const res = this.circuitParserService.parseToGraphData(circuitData);
      if (!res.ok) {
        throw new CircuitParserUsecaseError("Failed to parse circuit data.", {
          cause: res.error,
        });
      }

      return { ok: true, value: res.value };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitParserUsecaseError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitParserUsecaseError("Unknown error occurred while parsing circuit data.", { cause: err }),
      };
    }
  }
}
