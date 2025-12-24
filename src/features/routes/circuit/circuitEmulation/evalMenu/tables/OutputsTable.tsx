import Box from "@/components/atoms/Box";
import Typography from "@/components/atoms/Typography";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/atoms/table";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";

interface OutputsTableProps {
  outputs: Record<CircuitNodeId, EvalResult>;
}

export default function OutputsTable({ outputs }: OutputsTableProps) {
  return (
    <Table style={{ width: "400px" }}>
      <TableCaption>
        <Typography size="medium">Outputs</Typography>
      </TableCaption>
      <TableBody>
        {Object.entries(outputs).map(([nodeId, output]) => (
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
                  backgroundColor: output ? "var(--color-circuit-state-high)" : "var(--color-circuit-state-low)",
                  border: "none",
                }}
              >
                <Typography style={{ textAlign: "center" }}>{output ? "True" : "False"}</Typography>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
