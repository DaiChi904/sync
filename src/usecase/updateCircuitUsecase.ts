import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type {
  CircuitNotFoundError,
  ICircuitRepository,
  InvalidSaveMethodError,
} from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { IUpdateCircuitUsecase } from "@/domain/model/usecase/IUpdateCircuitUsecase";
import type { Result } from "@/utils/result";

interface UpdateCircuitUsecaseDependencies {
  circuitRepository: ICircuitRepository;
}

export class UpdateCircuitUsecase implements IUpdateCircuitUsecase {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: UpdateCircuitUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async execute(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  > {
    return await this.circuitRepository.save("UPDATE", newCircuit);
  }
}
