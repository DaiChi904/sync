import PrimaryButton from "@/components/atoms/buttons/PrimaryButton";
import Flex from "@/components/atoms/Flex";
import Typography from "@/components/atoms/Typography";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useSeedPageHandlerContext } from "@/contexts/SeedPageHandlerContext";
import type { SeedPageStatus } from "@/domain/model/handler/ISeedPageHandler";

export default function SeedPageLayout() {
  const { status, countDown, seed } = useSeedPageHandlerContext();

  const statusMsg = new Map<SeedPageStatus, string>([
    ["pending", "Waiting your instruction..."],
    ["seeding", "Seeding..."],
    ["done", "Done."],
    ["error", "Abort with error. See console for more infomation."],
  ]);

  return (
    <LayoutContainer>
      <Flex direction="column" style={{ padding: 10 }}>
        <Typography size="superLarge">Seed</Typography>
        <Typography size="medium">{statusMsg.get(status)}</Typography>
        <Flex style={{ padding: 5 }}>
          <PrimaryButton
            variant="outlined"
            animation="push"
            style={{ borderRadius: 10, paddingLeft: 25, paddingRight: 25 }}
            onClick={() => seed()}
          >
            Seed
          </PrimaryButton>
        </Flex>
        {status === "done" && <Typography size="medium">Go to home in {countDown} seconds...</Typography>}
      </Flex>
    </LayoutContainer>
  );
}
