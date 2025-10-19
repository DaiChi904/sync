import type { CircuitGraphData } from "@/domain/model/entity/circuitGraphData";
import type { IEmulationOrganizer } from "@/domain/model/service/IEmulationOrganizer";
import {
  type CreateEmulationUsecase,
  EmulationUsecaseError,
  type IEmulationUsecase,
} from "@/domain/model/usecase/IEmulationUsecase";
import type { EvalDelay } from "@/domain/model/valueObject/evalDelay";
import type { EmulationOrganizer } from "@/domain/service/emulationOrganizer";
import type { CircuitEmulatorService } from "@/domain/service/newCircuitEmulatorService";

interface GenerateCircuitEmulatorServiceClientUsecaseDependencies {
  emulationOrganizer: IEmulationOrganizer;
}

export class EmulationUsecase implements IEmulationUsecase {
  private readonly emulationOrganizer: IEmulationOrganizer;

  private constructor({ emulationOrganizer }: GenerateCircuitEmulatorServiceClientUsecaseDependencies) {
    this.emulationOrganizer = emulationOrganizer;
  }

  static from(
    circuitEmulatorService: typeof CircuitEmulatorService,
    emulationOrganizer: typeof EmulationOrganizer,
  ): CreateEmulationUsecase {
    return (graphData: CircuitGraphData, evalDelay: EvalDelay) => {
      const client = circuitEmulatorService.from(graphData, evalDelay);
      if (!client.ok) {
        const err = new EmulationUsecaseError("Failed to generate circuit emulator service client.", {
          cause: client.error,
        });
        console.error(err);
        return {
          ok: false,
          error: err,
        };
      }

      const organizer = emulationOrganizer.from(client.value);
      return {
        ok: true,
        value: new EmulationUsecase({ emulationOrganizer: organizer }),
      };
    };
  }
}
