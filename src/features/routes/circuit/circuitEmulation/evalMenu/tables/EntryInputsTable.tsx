import Button from "@/components/atoms/buttons/Button";
import Typography from "@/components/atoms/Typography";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/atoms/table";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import type { InputRecord } from "@/domain/model/valueObject/inputRecord";

interface EntryInputsTableProps {
  entryInputs: InputRecord;
  updateEntryInputs: (nodeId: CircuitNodeId, value: EvalResult) => void;
}

export default function EntryInputsTable({ entryInputs, updateEntryInputs }: EntryInputsTableProps) {
  return (
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
  );
}
