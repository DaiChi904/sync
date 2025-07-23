import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { ICircuitEditorUsecase } from "@/domain/model/usecase/ICircuitEditorUsecase";
import type { Result } from "@/utils/result";

interface CircuitEditorUsecaseDependencies {
  circuitRepository: ICircuitRepository;
  circuitParserService: ICircuitParserService;
}

export class CircuitEditorUsecaseGenerateNewCircuitDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitEditorUsecaseGenerateNewCircuitDataError";
  }
}

export class CircuitEditorUsecase implements ICircuitEditorUsecase {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitEditorUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async save(newCircuit: Circuit): Promise<Result<void>> {
    const res = await this.circuitRepository.save("UPDATE", newCircuit);

    switch (res.ok) {
      case true: {
        return { ok: true, value: undefined };
      }
      case false: {
        console.error(res.error);
        return { ok: false, error: res.error };
      }
    }
  }
}
