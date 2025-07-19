import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation.type";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";

export interface ICircuitEmulatorService {
  setup(): Result<void>;
  eval(entryInputs: InputRecord, phase: Phase): Result<void>;
  getInfomationById(id: CircuitNodeId): Result<NodeInformation>;
}
