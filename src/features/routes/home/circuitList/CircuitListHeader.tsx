import Flex from "@/components/atoms/Flex";

export default function CircuitListHeader() {
  return (
    <Flex
      style={{ padding: 5, borderBottom: "1px solid var(--color-black)", backgroundColor: "var(--color-light-gray)" }}
    >
      <Flex basis="20%">Name</Flex>
      <Flex basis="40%">Description</Flex>
      <Flex basis="20%">Created At</Flex>
      <Flex basis="20%">Updated At</Flex>
    </Flex>
  );
}
