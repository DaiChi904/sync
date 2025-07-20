import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { ICircuitEmulatorService } from "../service/ICircuitEmulatorService";

export type IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput = Readonly<Result<ICircuitEmulatorService>>;

export interface IGenerateCircuitEmulatorServiceClientUsecase {
  generate(circuitGraphData: CircuitGraphData): Promise<IGenerateCircuitEmulatorServiceClientUsecaseGenerateOutput>;
}
