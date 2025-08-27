import SecondaryButton from "@/components/atoms/buttons/SecondaryButton";
import Flex from "@/components/atoms/Flex";
import Typography from "@/components/atoms/Typography";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";

interface BaseUtilityMenuProps {
  at: Coordinate;
  menuOptions: Array<{
    label: string;
    // biome-ignore lint/suspicious/noExplicitAny: This is fine.
    onClickHandler: (...args: any[]) => void;
  }>;
}

export default function BaseUtilityMenu({ at, menuOptions }: BaseUtilityMenuProps) {
  const MENU_HEIGHT = 30
  return (
    <foreignObject x={at.x} y={at.y} width={150} height={MENU_HEIGHT * menuOptions.length}>
      <Flex
        direction="column"
        style={{
          position: "relative",
          border: "solid 1px var(--color-white)",
          background: "var(--color-white)",
        }}
      >
        {menuOptions.map((option) => {
          return (
            <SecondaryButton
              key={option.label}
              style={{ height: MENU_HEIGHT, padding: 5, border: "none" }}
              variant="outlined"
              animation="push"
              onClick={option.onClickHandler}
            >
              <Typography size="default">{option.label}</Typography>
            </SecondaryButton>
          );
        })}
      </Flex>
    </foreignObject>
  );
}
