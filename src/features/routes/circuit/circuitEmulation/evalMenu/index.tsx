import SecondaryButton from "@/components/atoms/buttons/SecondaryButton";
import Flex from "@/components/atoms/Flex";
import SecondaryInput from "@/components/atoms/input/SecondaryInput";
import Typography from "@/components/atoms/Typography";
import type { ICircuitEmulationPageController } from "@/domain/model/controller/ICircuitEmulationPageController";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { EvalDuration } from "@/domain/model/valueObject/evalDuration";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";
import type { InputRecord } from "@/domain/model/valueObject/inputRecord";
import type { Tick } from "@/domain/model/valueObject/tick";
import EntryInputsTable from "./tables/EntryInputsTable";
import OutputsTable from "./tables/OutputsTable";

interface EvalMenuProps {
  error: ICircuitEmulationPageController["error"];
  currentTick: Tick;
  evalDuration: EvalDuration;
  entryInputs: InputRecord;
  outputs: Record<CircuitNodeId, EvalResult>;
  updateEntryInputs: (nodeId: CircuitNodeId, value: EvalResult) => void;
  evalCircuit: () => void;
  changeEvalDuration: (duration: EvalDuration) => void;
}

export default function EvalMenu({
  error,
  currentTick,
  evalDuration,
  entryInputs,
  outputs,
  updateEntryInputs,
  evalCircuit,
  changeEvalDuration,
}: EvalMenuProps) {
  return (
    <Flex direction="column" grow={1} style={{ padding: 50 }}>
      <Typography size="large">Circuit Evaluation Menu</Typography>
      <SecondaryButton
        onClick={evalCircuit}
        variant="outlined"
        animation="slide"
        style={{ border: "none", width: "300px", height: "50px" }}
      >
        <Typography size="mediumPlus">{`Eval >>>`}</Typography>
      </SecondaryButton>
      {error.hasError("emulationEnvironmentCreationError") && (
        <Typography size="medium" style={{ color: "red", marginTop: 10 }}>
          Creation emulation environment failed.
        </Typography>
      )}
      {error.hasError("failedToEvalCircuitError") && (
        <Typography size="medium" style={{ color: "red", marginTop: 10 }}>
          Failed to evaluate the circuit.
        </Typography>
      )}

      <Typography size="mediumPlus">Current Tick: {currentTick}</Typography>

      <SecondaryInput
        variant="outlined"
        type="number"
        value={evalDuration}
        onChange={(ev) => {
          const value = Math.max(1, Math.min(1000, Number(ev.target.value)));
          changeEvalDuration(EvalDuration.from(value));
        }}
      />

      <EntryInputsTable entryInputs={entryInputs} updateEntryInputs={updateEntryInputs} />
      <OutputsTable outputs={outputs} />
    </Flex>
  );
}
