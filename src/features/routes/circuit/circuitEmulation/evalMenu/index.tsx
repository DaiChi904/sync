import Box from "@/components/atoms/Box";
import Button from "@/components/atoms/buttons/Button";
import SecondaryButton from "@/components/atoms/buttons/SecondaryButton";
import Flex from "@/components/atoms/Flex";
import SecondaryInput from "@/components/atoms/input/SecondaryInput";
import Typography from "@/components/atoms/Typography";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/atoms/table";
import type { ICircuitEmulationPageController } from "@/domain/model/controller/ICircuitEmulationPageController";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { EvalDuration } from "@/domain/model/valueObject/evalDuration";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import type { InputRecord } from "@/domain/model/valueObject/inputRecord";
import type { Tick } from "@/domain/model/valueObject/tick";

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

      <Table style={{ width: "400px" }}>
        <TableCaption>
          <Typography size="medium">Entry Inputs</Typography>
        </TableCaption>
        <TableBody>
          {entryInputs &&
            Object.entries(entryInputs).map(([nodeId, input]) => (
              <TableRow key={nodeId}>
                <TableCell style={{ width: "300px" }}>
                  <Typography size="defaultPlus" style={{ marginRight: 10 }}>
                    Node ID: {nodeId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    className="button-animation-push"
                    style={{
                      color: "white",
                      cursor: "pointer",
                      width: "100px",
                      height: "30px",
                      padding: 5,
                      backgroundColor: input ? "var(--color-circuit-state-high)" : "var(--color-circuit-state-low)",
                      border: "none",
                    }}
                    onClick={() => updateEntryInputs(CircuitNodeId.from(nodeId), EvalResult.from(!input))}
                  >
                    <Typography>{input ? "True" : "False"}</Typography>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Table style={{ width: "400px" }}>
        <TableCaption>
          <Typography size="medium">Outputs</Typography>
        </TableCaption>
        <TableBody>
          {entryInputs &&
            Object.entries(outputs).map(([nodeId, input]) => (
              <TableRow key={nodeId}>
                <TableCell style={{ width: "300px" }}>
                  <Typography size="defaultPlus" style={{ marginRight: 10 }}>
                    Node ID: {nodeId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      width: "100px",
                      height: "30px",
                      padding: 5,
                      backgroundColor: input ? "var(--color-circuit-state-high)" : "var(--color-circuit-state-low)",
                      border: "none",
                    }}
                  >
                    <Typography style={{ textAlign: "center" }}>{input ? "True" : "False"}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Flex>
  );
}
