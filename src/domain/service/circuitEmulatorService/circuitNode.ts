import { NodeInformation } from "@/domain/model/entity/nodeInfomation";
import { ModelValidationError } from "@/domain/model/modelValidationError";
import { CircuitNodeCreationError, CircuitNodeEvalError, type ICircuitNode } from "@/domain/model/service/ICircuitNode";
import { UnexpectedError } from "@/domain/model/unexpectedError";
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
  protected lastOutput: EvalResult;
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
    this.lastOutput = EvalResult.from(false);
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
  ): Result<EntryNode | ExitNode | AndNode | OrNode | NotNode | JunctionNode, CircuitNodeCreationError> {
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
        const err = new CircuitNodeCreationError(id, type);
        console.error(err);
        return {
          ok: false,
          error: err,
        };
      }
    }
  }

  init(): void {
    this.lastOutput = EvalResult.from(false);
    this.outputQueue = Array.from({ length: EvalDelay.unBrand(this.delay) }).fill(
      EvalResult.from(false),
    ) as Array<EvalResult>;
  }

  abstract eval(inputs: InputRecord): Result<EvalResult, CircuitNodeEvalError | UnexpectedError>;

  getInformation(): NodeInformation {
    return NodeInformation.from({
      id: this.id,
      type: this.type,
      inputs: this.inputs,
      outputs: this.outputs,
      executionOrder: this.executionOrder,
      delay: this.delay,
      lastOutput: this.lastOutput,
      outputQueue: this.outputQueue,
    });
  }

  protected isValidInputRecord(inputRecord: InputRecord): boolean {
    const inputIds = (Object.entries(inputRecord) as Array<[CircuitNodeInputId, EvalResult]>).map((value) =>
      CircuitNodeId.from(value[0]),
    );

    const isInputAmountValid = this.type !== "ENTRY" ? inputIds.length === this.inputs.length : inputIds.length === 1;
    const isSatisfiedInputIds =
      this.type !== "ENTRY" ? inputIds.every((inputId) => this.inputs.includes(inputId)) : true;

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

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeEvalError | UnexpectedError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeEvalError("Invalid input record.", this.getInformation());
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = inputMap.get(this.id);
      if (result === undefined) {
        throw new CircuitNodeEvalError("Failed to refer input.", this.getInformation());
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeEvalError("Failed to get next output.", this.getInformation());
      }

      this.lastOutput = result;
      this.outputQueue.push(result);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof CircuitNodeEvalError: {
          return { ok: false, error: err };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
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

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeEvalError | UnexpectedError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeEvalError("Invalid input record.", this.getInformation());
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = inputMap.get(this.inputs[0]);
      if (result === undefined) {
        throw new CircuitNodeEvalError("Failed to refer input.", this.getInformation());
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeEvalError("Failed to get next output.", this.getInformation());
      }

      this.lastOutput = result;
      this.outputQueue.push(result);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof CircuitNodeEvalError: {
          return { ok: false, error: err };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
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

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeEvalError | UnexpectedError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeEvalError("Invalid input record.", this.getInformation());
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = EvalResult.from(
        this.inputs.map((inputId) => inputMap.get(inputId)).every((input) => input === true),
      );
      if (result === undefined) {
        throw new CircuitNodeEvalError("Failed to refer input.", this.getInformation());
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeEvalError("Failed to get next output.", this.getInformation());
      }

      this.lastOutput = result;
      this.outputQueue.push(result);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError: {
          const circuitNodeEvalError = new CircuitNodeEvalError("Invalid model provided.", this.getInformation(), {
            cause: err,
          });
          return { ok: false, error: circuitNodeEvalError };
        }
        case err instanceof CircuitNodeEvalError: {
          return { ok: false, error: err };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
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

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeEvalError | UnexpectedError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeEvalError("Invalid input record.", this.getInformation());
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = EvalResult.from(
        this.inputs.map((inputId) => inputMap.get(inputId)).some((input) => input === true),
      );
      if (result === undefined) {
        throw new CircuitNodeEvalError("Failed to refer input.", this.getInformation());
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeEvalError("Failed to get next output.", this.getInformation());
      }

      this.lastOutput = result;
      this.outputQueue.push(result);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError: {
          const circuitNodeEvalError = new CircuitNodeEvalError("Invalid model provided.", this.getInformation(), {
            cause: err,
          });
          return { ok: false, error: circuitNodeEvalError };
        }
        case err instanceof CircuitNodeEvalError: {
          return { ok: false, error: err };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
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

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeEvalError | UnexpectedError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeEvalError("Invalid input record.", this.getInformation());
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = inputMap.get(this.inputs[0]) === false ? EvalResult.from(true) : EvalResult.from(false);
      if (result === undefined) {
        throw new CircuitNodeEvalError("Failed to refer input.", this.getInformation());
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeEvalError("Failed to get next output", this.getInformation());
      }

      this.lastOutput = result;
      this.outputQueue.push(result);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError: {
          const circuitNodeEvalError = new CircuitNodeEvalError("Invalid model provided.", this.getInformation(), {
            cause: err,
          });
          return { ok: false, error: circuitNodeEvalError };
        }
        case err instanceof CircuitNodeEvalError: {
          return { ok: false, error: err };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
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

  eval(inputs: InputRecord): Result<EvalResult, CircuitNodeEvalError | UnexpectedError> {
    try {
      const isValidInputRecord = this.isValidInputRecord(inputs);

      if (!isValidInputRecord) {
        throw new CircuitNodeEvalError("Invalid input record.", this.getInformation());
      }

      const inputMap = this.inputRecordToInputMap(inputs);
      const result = inputMap.get(this.inputs[0]);
      if (result === undefined) {
        throw new CircuitNodeEvalError("Failed to refer input.", this.getInformation());
      }

      const nextOutput = this.outputQueue.shift();
      if (nextOutput === undefined) {
        throw new CircuitNodeEvalError("Failed to get next output.", this.getInformation());
      }

      this.lastOutput = result;
      this.outputQueue.push(result);

      return { ok: true, value: nextOutput };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof CircuitNodeEvalError: {
          return { ok: false, error: err };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }
}
