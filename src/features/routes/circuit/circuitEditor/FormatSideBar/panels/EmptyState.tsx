import Flex from "@/components/atoms/Flex";
import Typography from "@/components/atoms/Typography";

export default function EmptyState() {
  return (
    <Flex justifyContent="center" alignItems="center" grow={1}>
      <Typography>No data</Typography>
    </Flex>
  );
}
