import Flex from "@/components/atoms/Flex";

interface BaseUtilitiesMenuProps {
  menuOptions: Array<{
    label: string;
    // biome-ignore lint/suspicious/noExplicitAny: This is fine.
    onClickHandler: (...args: any[]) => void;
  }>;
}

export default function BaseUtilitiesMenu({ menuOptions }: BaseUtilitiesMenuProps) {
  return (
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
  );
}
