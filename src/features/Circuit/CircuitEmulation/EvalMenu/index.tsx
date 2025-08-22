import Box from "@/components/atoms/Box";
import Flex from "@/components/atoms/Flex";
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
    <Flex direction="column" grow={1} style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
      <Typography size="large">Circuit Evaluation Menu</Typography>
      <Box
        onClick={evalCircuit}
        className="animated"
        style={{ marginTop: 10, cursor: "pointer", border: "1px solid #ccc", padding: 10 }}
      >
        <Typography size="mediumPlus">Eval</Typography>
      </Box>
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
      <Typography size="medium" style={{ marginRight: 10 }}>
        Entry Inputs
      </Typography>
      {entryInputs &&
        Object.entries(entryInputs).map(([nodeId, input]) => (
          <Flex key={nodeId} direction="row" alignItems="center" style={{ marginTop: 5, gap: 10 }}>
            <Typography size="defaultPlus" style={{ marginRight: 10 }}>
              Node ID: {nodeId}
            </Typography>
            <Box
              onClick={() => updateEntryInputs(CircuitNodeId.from(nodeId), EvalResult.from(!input))}
              className="animated"
              style={{
                padding: 5,
                backgroundColor: input ? "#4caf50" : "#f44336",
                color: "white",
                cursor: "pointer",
              }}
            >
              {input ? "True" : "False"}
            </Box>
          </Flex>
        ))}
      <Typography size="medium" style={{ marginRight: 10 }}>
        Outputs
      </Typography>
      {outputs &&
        Object.entries(outputs).map(([nodeId, input]) => (
          <Flex key={nodeId} direction="row" alignItems="center" style={{ marginTop: 5, gap: 10 }}>
            <Typography size="defaultPlus" style={{ marginRight: 10 }}>
              Node ID: {nodeId}
            </Typography>
            <Box
              style={{
                padding: 5,
                backgroundColor: input ? "#4caf50" : "#f44336",
                color: "white",
              }}
            >
              {input ? "True" : "False"}
            </Box>
          </Flex>
        ))}
    </Flex>
  );
}
