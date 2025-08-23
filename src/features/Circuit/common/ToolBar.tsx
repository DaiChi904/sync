import type { ComponentProps } from "react";
import Flex from "@/components/atoms/Flex";
import ExpandMenu from "@/components/molecules/ExpandMenu";

interface ToolBarProps {
  menuOptions?: Array<ComponentProps<typeof ExpandMenu>>;
}

export default function ToolBar({ menuOptions }: ToolBarProps) {
  return (
    <Flex
      style={{
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 100,
        paddingRight: 10,
        background: "var(--color-primary)",
      }}
    >
      {menuOptions?.map((option) => (
        <ExpandMenu
          key={option.label}
          label={option.label}
          menuOptions={option.menuOptions}
          isExpanded={option.isExpanded}
          onClickExpand={option.onClickExpand}
          onClickClose={option.onClickClose}
          theme="primary"
          variant="filled"
        />
      ))}
    </Flex>
  );
}
