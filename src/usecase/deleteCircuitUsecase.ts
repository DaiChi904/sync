import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type {
  CircuitNotFoundError,
  ICircuitRepository,
} from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { IDeleteCircuitUsecase } from "@/domain/model/usecase/IDeleteCircuitUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { Result } from "@/utils/result";

interface DeleteCircuitUsecaseDependencies {
  circuitRepository: ICircuitRepository;
}

export class DeleteCircuitUsecase implements IDeleteCircuitUsecase {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: DeleteCircuitUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async execute(
    id: CircuitId,
  ): Promise<Result<void, DataIntegrityError | InfraError | CircuitNotFoundError | UnexpectedError>> {
    return await this.circuitRepository.delete(id);
  }
}
