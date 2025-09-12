import { NodeInformation } from "@/domain/model/entity/nodeInfomation.type";
import { CircuitNodeError, type ICircuitNode } from "@/domain/model/service/ICircuitNode";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodeInputId } from "@/domain/model/valueObject/circuitNodeInputId";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { EvalDelay } from "@/domain/model/valueObject/evalDelay";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import type { ExecutionOrder } from "@/domain/model/valueObject/executionOrder";
import type { InputRecord } from "@/domain/model/valueObject/inputRecord";
import type { Result } from "@/utils/result";

export abstract class CircuitNode implements ICircuitNode {
  protected readonly id: CircuitNodeId;
  protected readonly type: CircuitNodeType;
  protected readonly inputs: Array<CircuitNodeId>;
  protected readonly outputs: Array<CircuitNodeId>;
  protected readonly executionOrder: ExecutionOrder;
  protected outputQueue: Array<EvalResult>;
  protected delay: EvalDelay;

  constructor(
    id: CircuitNodeId,
    type: CircuitNodeType,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
    executionOrder: ExecutionOrder,
    delay: EvalDelay,
  ) {
    this.id = id;
    this.type = type;
    this.inputs = inputs;
    this.outputs = outputs;
    this.executionOrder = executionOrder;
    this.outputQueue = [];
    this.delay = delay; // {n} tick
  }

  static from(
    id: CircuitNodeId,
    type: CircuitNodeType,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
    executionOrder: ExecutionOrder,
    delay: EvalDelay,
  ): Result<EntryNode | ExitNode | AndNode | OrNode | NotNode | JunctionNode, CircuitNodeError> {
    switch (type) {
      case "ENTRY":
        return { ok: true, value: new EntryNode(id, inputs, outputs, executionOrder, delay) };
      case "EXIT":
        return { ok: true, value: new ExitNode(id, inputs, outputs, executionOrder, delay) };
      case "AND":
        return { ok: true, value: new AndNode(id, inputs, outputs, executionOrder, delay) };
      case "OR":
        return { ok: true, value: new OrNode(id, inputs, outputs, executionOrder, delay) };
      case "NOT":
        return { ok: true, value: new NotNode(id, inputs, outputs, executionOrder, delay) };
      case "JUNCTION":
        return { ok: true, value: new JunctionNode(id, inputs, outputs, executionOrder, delay) };
      default: {
        const err = new CircuitNodeError(`Failed to generate circuit node. Received invalid node type: ${type}`);
        console.error(err);
        return {
          ok: false,
          error: err,
        };
      }
    }
  }

  init(): void {
    this.outputQueue = [EvalResult.from(false)];
  }

  abstract eval(inputs: InputRecord): Result<EvalResult, CircuitNodeError>;

  getInformation(): NodeInformation {
    return NodeInformation.from({
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      executionOrder: this.executionOrder,
      outputQueue: this.outputQueue,
    });
  }

  protected isValidInputRecord(inputRecord: InputRecord): boolean {
    const inputIds = (Object.entries(inputRecord) as Array<[CircuitNodeInputId, EvalResult]>).map((value) =>
      CircuitNodeId.from(value[0]),
    );

    const isInputAmountValid = inputIds.length === this.inputs.length;
    const isSatisfiedInputIds = inputIds.every((inputId) => this.inputs.includes(inputId));

    return isInputAmountValid && isSatisfiedInputIds;
  }

  protected inputRecordToInputMap(inputRecord: InputRecord): Map<CircuitNodeId, EvalResult> {
    const inputMap = new Map<CircuitNodeId, EvalResult>();
    for (const [inputId, inputValue] of Object.entries(inputRecord)) {
      inputMap.set(CircuitNodeId.from(inputId), inputValue);
    }
    return inputMap;
  }
}

class EntryNode extends CircuitNode {
  constructor(
    id: CircuitNodeId,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
    executionOrder: ExecutionOrder,
    delay: EvalDelay,
  ) {
    super(id, CircuitNodeType.from("ENTRY"), inputs, outputs, executionOrder, delay);
  }

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeError(
          `Cannot evaluate ENTRY node. Invalid input record for ENTRY node. NodeId: ${this.id}`,
        );
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = inputMap.get(this.id);
      if (result === undefined) {
        throw new CircuitNodeError(
          `Cannot evaluate ENTRY node. Failed to refer input of ENTRY node. NodeId: ${this.id}`,
        );
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeError(
          `Cannot evaluate ENTRY node. Failed to get next output of ENTRY node. NodeId: ${this.id}`,
        );
      }

      const isOutputChanged = result !== nextOutput;
      isOutputChanged &&
        this.outputQueue.push(
          ...[...(Array.from({ length: EvalDelay.unBrand(this.delay) }).fill(nextOutput) as Array<EvalResult>), result],
        );

      !(this.outputQueue.length > 1) && this.outputQueue.push(nextOutput);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitNodeError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitNodeError(`Unknown error occurred while evaluateing ENTRY node. id: ${this.id}`, {
          cause: err,
        }),
      };
    }
  }
}

class ExitNode extends CircuitNode {
  constructor(
    id: CircuitNodeId,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
    executionOrder: ExecutionOrder,
    delay: EvalDelay,
  ) {
    super(id, CircuitNodeType.from("EXIT"), inputs, outputs, executionOrder, delay);
  }

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeError(`Cannot evaluate EXIT node. Invalid input record for EXIT node. NodeId: ${this.id}`);
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = inputMap.get(this.id);
      if (result === undefined) {
        throw new CircuitNodeError(`Cannot evaluate EXIT node. Failed to refer input of EXIT node. NodeId: ${this.id}`);
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeError(
          `Cannot evaluate EXIT node. Failed to get next output of EXIT node. NodeId: ${this.id}`,
        );
      }

      const isOutputChanged = result !== nextOutput;
      isOutputChanged &&
        this.outputQueue.push(
          ...[...(Array.from({ length: EvalDelay.unBrand(this.delay) }).fill(nextOutput) as Array<EvalResult>), result],
        );

      !(this.outputQueue.length > 1) && this.outputQueue.push(nextOutput);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitNodeError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitNodeError(`Unknown error occurred while evaluateing EXIT node. id: ${this.id}`, {
          cause: err,
        }),
      };
    }
  }
}

class AndNode extends CircuitNode {
  constructor(
    id: CircuitNodeId,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
    executionOrder: ExecutionOrder,
    delay: EvalDelay,
  ) {
    super(id, CircuitNodeType.from("AND"), inputs, outputs, executionOrder, delay);
  }

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeError(`Cannot evaluate AND node. Invalid input record for AND node. NodeId: ${this.id}`);
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = EvalResult.from(
        this.inputs.map((inputId) => inputMap.get(inputId)).every((input) => input === true),
      );
      if (result === undefined) {
        throw new CircuitNodeError(`Cannot evaluate AND node. Failed to refer input of AND node. NodeId: ${this.id}`);
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeError(
          `Cannot evaluate AND node. Failed to get next output of AND node. NodeId: ${this.id}`,
        );
      }

      const isOutputChanged = result !== nextOutput;
      isOutputChanged &&
        this.outputQueue.push(
          ...[...(Array.from({ length: EvalDelay.unBrand(this.delay) }).fill(nextOutput) as Array<EvalResult>), result],
        );

      !(this.outputQueue.length > 1) && this.outputQueue.push(nextOutput);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitNodeError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitNodeError(`Unknown error occurred while evaluateing AND node. id: ${this.id}`, {
          cause: err,
        }),
      };
    }
  }
}

// --- OrNode ---
class OrNode extends CircuitNode {
  constructor(
    id: CircuitNodeId,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
    executionOrder: ExecutionOrder,
    delay: EvalDelay,
  ) {
    super(id, CircuitNodeType.from("OR"), inputs, outputs, executionOrder, delay);
  }

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeError(`Cannot evaluate OR node. Invalid input record for OR node. NodeId: ${this.id}`);
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = EvalResult.from(
        this.inputs.map((inputId) => inputMap.get(inputId)).some((input) => input === true),
      );
      if (result === undefined) {
        throw new CircuitNodeError(`Cannot evaluate OR node. Failed to refer input of OR node. NodeId: ${this.id}`);
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeError(`Cannot evaluate OR node. Failed to get next output of OR node. NodeId: ${this.id}`);
      }

      const isOutputChanged = result !== nextOutput;
      isOutputChanged &&
        this.outputQueue.push(
          ...[...(Array.from({ length: EvalDelay.unBrand(this.delay) }).fill(nextOutput) as Array<EvalResult>), result],
        );

      !(this.outputQueue.length > 1) && this.outputQueue.push(nextOutput);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitNodeError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitNodeError(`Unknown error occurred while evaluateing OR node. id: ${this.id}`, {
          cause: err,
        }),
      };
    }
  }
}

// --- NotNode ---
class NotNode extends CircuitNode {
  constructor(
    id: CircuitNodeId,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
    executionOrder: ExecutionOrder,
    delay: EvalDelay,
  ) {
    super(id, CircuitNodeType.from("NOT"), inputs, outputs, executionOrder, delay);
  }

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeError(`Cannot evaluate EXIT node. Invalid input record for EXIT node. NodeId: ${this.id}`);
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = inputMap.get(this.id) === false ? EvalResult.from(true) : EvalResult.from(false);
      if (result === undefined) {
        throw new CircuitNodeError(`Cannot evaluate EXIT node. Failed to refer input of EXIT node. NodeId: ${this.id}`);
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeError(
          `Cannot evaluate EXIT node. Failed to get next output of EXIT node. NodeId: ${this.id}`,
        );
      }

      const isOutputChanged = result !== nextOutput;
      isOutputChanged &&
        this.outputQueue.push(
          ...[...(Array.from({ length: EvalDelay.unBrand(this.delay) }).fill(nextOutput) as Array<EvalResult>), result],
        );

      !(this.outputQueue.length > 1) && this.outputQueue.push(nextOutput);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitNodeError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitNodeError(`Unknown error occurred while evaluateing EXIT node. id: ${this.id}`, {
          cause: err,
        }),
      };
    }
  }
}

// --- JunctionNode ---
class JunctionNode extends CircuitNode {
  constructor(
    id: CircuitNodeId,
    inputs: Array<CircuitNodeId>,
    outputs: Array<CircuitNodeId>,
    executionOrder: ExecutionOrder,
    delay: EvalDelay,
  ) {
    super(id, CircuitNodeType.from("JUNCTION"), inputs, outputs, executionOrder, delay);
  }

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeError(`Cannot evaluate EXIT node. Invalid input record for EXIT node. NodeId: ${this.id}`);
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = inputMap.get(this.id);
      if (result === undefined) {
        throw new CircuitNodeError(`Cannot evaluate EXIT node. Failed to refer input of EXIT node. NodeId: ${this.id}`);
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeError(
          `Cannot evaluate EXIT node. Failed to get next output of EXIT node. NodeId: ${this.id}`,
        );
      }

      const isOutputChanged = result !== nextOutput;
      isOutputChanged &&
        this.outputQueue.push(
          ...[...(Array.from({ length: EvalDelay.unBrand(this.delay) }).fill(nextOutput) as Array<EvalResult>), result],
        );

      !(this.outputQueue.length > 1) && this.outputQueue.push(nextOutput);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitNodeError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitNodeError(`Unknown error occurred while evaluateing EXIT node. id: ${this.id}`, {
          cause: err,
        }),
      };
    }
  }
}
