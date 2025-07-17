import Flex from "@/components/atoms/Flex";

export default function CircuitListHeader() {
  return (
    <Flex style={{ padding: 5, borderBottom: "1px solid #ccc", backgroundColor: "#eee" }}>
      <Flex style={{ width: "20%" }}>Name</Flex>
      <Flex style={{ width: "40%" }}>Description</Flex>
      <Flex style={{ width: "20%" }}>Created At</Flex>
      <Flex style={{ width: "20%" }}>Updated At</Flex>
    </Flex>
  );
}
