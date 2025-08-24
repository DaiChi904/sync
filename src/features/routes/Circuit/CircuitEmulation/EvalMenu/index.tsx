import Box from "@/components/atoms/Box";
import Button from "@/components/atoms/buttons/Button";
import SecondaryButton from "@/components/atoms/buttons/SecondaryButton";
import Flex from "@/components/atoms/Flex";
import { Table, TableCaption, TableCell, TableRow } from "@/components/atoms/Table";
import Typography from "@/components/atoms/Typography";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import type { InputRecord } from "@/domain/model/valueObject/inputRecord";
import type { Phase } from "@/domain/model/valueObject/phase";

interface EvalMenuProps {
  error: {
    failedToSetupEmulatorServiceError: boolean;
    failedToEvalCircuitError: boolean;
  };
  currentPhase: Phase;
  entryInputs: InputRecord;
  outputs: Record<CircuitNodeId, EvalResult>;
  updateEntryInputs: (nodeId: CircuitNodeId, value: EvalResult) => void;
  evalCircuit: () => void;
}

export default function EvalMenu({
  error,
  currentPhase,
  entryInputs,
  outputs,
  updateEntryInputs,
  evalCircuit,
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
      {error.failedToSetupEmulatorServiceError && (
        <Typography size="medium" style={{ color: "red", marginTop: 10 }}>
          Failed to setup the circuit emulator service.
        </Typography>
      )}
      {error.failedToEvalCircuitError && (
        <Typography size="medium" style={{ color: "red", marginTop: 10 }}>
          Failed to evaluate the circuit.
        </Typography>
      )}

      <Typography size="mediumPlus">Current Phase: {currentPhase}</Typography>

      <Table style={{ width: "400px" }}>
        <TableCaption>
          <Typography size="medium">Entry Inputs</Typography>
        </TableCaption>
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
      </Table>

      <Table style={{ width: "400px" }}>
        <TableCaption>
          <Typography size="medium">Outputs</Typography>
        </TableCaption>
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
      </Table>
    </Flex>
  );
}
