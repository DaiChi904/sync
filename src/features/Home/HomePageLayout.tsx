import Flex from "@/components/atoms/Flex";
import LayoutContainer from "@/components/layouts/LayoutContainer";

export default function HomePageLayout() {
  return (
    <LayoutContainer>
      <Flex direction="column" alignItems="center" justifyContent="center">
        <h1>Welcome to the Home Page</h1>
        <p>This is the main content area.</p>
      </Flex>
    </LayoutContainer>
  );
}
