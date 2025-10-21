import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import { CircuitDataParseError, type ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import { UnexpectedError } from "@/domain/model/unexpectedError";
import type { ICircuitParserUsecase } from "@/domain/model/usecase/ICircuitParserUsecase";
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

  parseToGuiData(circuitData: CircuitData): Result<CircuitGuiData, CircuitDataParseError | UnexpectedError> {
    try {
      const res = this.circuitParserService.parseToGuiData(circuitData);
      if (!res.ok) {
        throw res.error;
      }

      return { ok: true, value: res.value };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof CircuitDataParseError: {
          const circuitDataParseError = err;
          return { ok: false, error: circuitDataParseError };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }

  parseToGraphData(circuitData: CircuitData): Result<CircuitGraphData, CircuitDataParseError | UnexpectedError> {
    try {
      const res = this.circuitParserService.parseToGraphData(circuitData);
      if (!res.ok) {
        throw res.error;
      }

      return { ok: true, value: res.value };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof CircuitDataParseError: {
          const circuitDataParseError = err;
          return { ok: false, error: circuitDataParseError };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }
}
