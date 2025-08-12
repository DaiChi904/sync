import Flex from "@/components/atoms/Flex";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";

interface BaseUtilityMenuProps {
  at: Coordinate | null;
  menuOptions: Array<{
    label: string;
    // biome-ignore lint/suspicious/noExplicitAny: This is fine.
    onClickHandler: (...args: any[]) => void;
  }>;
}

export default function BaseUtilityMenu({ at, menuOptions }: BaseUtilityMenuProps) {
  return (
    <foreignObject x={at?.x ?? 0} y={at?.y ?? 0} width={75} height={200}>
      <Flex
        direction="column"
        style={{
          position: "relative",
          border: "solid 1px #fff",
          background: "#fff",
        }}
      >
        {menuOptions.map((option) => {
          return (
            <Flex key={option.label} className="animated" onClick={option.onClickHandler}>
              {option.label}
            </Flex>
          );
        })}
      </Flex>
    </foreignObject>
  );
}
