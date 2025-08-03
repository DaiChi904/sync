import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type {
  ICircuitParserUsecase,
  ICircuitParserUsecaseParseToGraphDataOutput,
  ICircuitParserUsecaseParseToGuiDataOutput,
} from "@/domain/model/usecase/ICircuitParserUsecase";
import type { CircuitData } from "@/domain/model/valueObject/circuitData";
import { Attempt } from "@/utils/attempt";

interface CircuitParserUsecaseDependencies {
  circuitParserService: ICircuitParserService;
}

export class CircuitParserUsecase implements ICircuitParserUsecase {
  private readonly circuitParserService: ICircuitParserService;

  constructor({ circuitParserService }: CircuitParserUsecaseDependencies) {
    this.circuitParserService = circuitParserService;
  }

  parseToGuiData(circuitData: CircuitData): ICircuitParserUsecaseParseToGuiDataOutput {
    return Attempt.proceed(
      () => {
        const res = this.circuitParserService.parseToGuiData(circuitData);
        if (!res.ok) {
          throw new Attempt.Abort("CircuitParserUsecase.parseToGuiData", "Failed to parse circuit data.", {
            cause: res.error,
          });
        }

        return { ok: true, value: res.value } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }

  parseToGraphData(circuitData: CircuitData): ICircuitParserUsecaseParseToGraphDataOutput {
    return Attempt.proceed(
      () => {
        const res = this.circuitParserService.parseToGraphData(circuitData);
        if (!res.ok) {
          throw new Attempt.Abort("CircuitParserUsecase.parseToGraphData", "Failed to parse circuit data.", {
            cause: res.error,
          });
        }

        return { ok: true, value: res.value } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }
}
