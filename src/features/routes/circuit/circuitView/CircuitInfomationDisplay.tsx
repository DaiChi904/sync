import Flex from "@/components/atoms/Flex";
import Typography from "@/components/atoms/Typography";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/atoms/table";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";

interface CircuitInfomationDisplayProps {
  overview: CircuitOverview;
}

export default function CircuitInfomationDisplay({ overview }: CircuitInfomationDisplayProps) {
  return (
    <Flex direction="column" grow={1} style={{ height: "100%", width: "100%", padding: 20 }}>
      <Typography size="superLarge">Infomation</Typography>
      <Flex>
        <Flex direction="column" basis="60%" style={{ padding: 10 }}>
          <Typography size="huge">{overview?.title}</Typography>
          <Typography size="medium">{overview?.description}</Typography>
        </Flex>
        <Flex direction="column" basis="40%" style={{ padding: 10, minWidth: "450px" }}>
          <Table>
            <TableCaption>
              <Typography size="medium" style={{ paddingLeft: 20, textAlign: "start" }}>
                Property
              </Typography>
            </TableCaption>
            <TableBody>
              <TableRow>
                <TableCell style={{ padding: "8px 20px" }}>
                  <Typography size="defaultPlus">ID</Typography>
                </TableCell>
                <TableCell style={{ padding: "8px 20px" }}>
                  <Typography size="defaultPlus">{overview?.id}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ padding: "8px 20px" }}>
                  <Typography size="defaultPlus">Created At</Typography>
                </TableCell>
                <TableCell style={{ padding: "8px 20px" }}>
                  <Typography size="defaultPlus">{overview?.createdAt}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ padding: "8px 20px" }}>
                  <Typography size="defaultPlus">Updated At</Typography>
                </TableCell>
                <TableCell style={{ padding: "8px 20px" }}>
                  <Typography size="defaultPlus">{overview?.updatedAt}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Flex>
      </Flex>
    </Flex>
  );
}
