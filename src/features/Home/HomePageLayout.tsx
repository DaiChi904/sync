import Flex from "@/components/atoms/Flex";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useHomePageHandlerContext } from "@/contexts/HomePageHandlerContext";

export default function HomePageLayout() {
  const { error, circuitOverviews } = useHomePageHandlerContext();

  console.log(error);
  console.log(circuitOverviews);

  return (
    <LayoutContainer>
      <Flex direction="column" alignItems="center" justifyContent="center">
        <h1>Welcome to the Home Page</h1>
        <p>This is the main content area.</p>
      </Flex>
    </LayoutContainer>
  );
}
