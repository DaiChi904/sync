import type { Result } from "@/utils/result";
import type { NodeInformation } from "../entity/nodeInfomation.type";
import type { ExecutionOrder } from "../valueObject/executionOrder";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";
import type { Tick } from "../valueObject/tick";

export interface ICircuitNode {
  setup(order: ExecutionOrder): Result<void>;
  init(): Result<void>;
  eval(inputs: InputRecord, phase: Phase, tick: Tick): Result<boolean>;
  getInformation(): NodeInformation;
}
