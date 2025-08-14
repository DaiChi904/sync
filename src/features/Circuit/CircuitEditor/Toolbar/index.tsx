import type { ComponentProps } from "react";
import Box from "@/components/atoms/Box";
import Flex from "@/components/atoms/Flex";
import ExpandMenu from "@/components/molecules/ExpandMenu";
import type { Circuit } from "@/domain/model/aggregate/circuit";

interface ToolbarProps {
  circuit: Circuit | undefined;
  open: "none" | "file" | "view" | "help";
  onClickExpand: (kind: "file" | "view" | "help") => void;
  onClickClose: () => void;
  fileMenuOptions: ComponentProps<typeof ExpandMenu>["menuOptions"];
  viewMenuOptions: ComponentProps<typeof ExpandMenu>["menuOptions"];
  helpMenuOptions: ComponentProps<typeof ExpandMenu>["menuOptions"];
}

export default function Toolbar({
  circuit,
  open,
  onClickExpand,
  onClickClose,
  fileMenuOptions,
  viewMenuOptions,
  helpMenuOptions,
}: ToolbarProps) {
  return (
    <Flex style={{ paddingBottom: 5, borderBottom: "1px solid black" }}>
      <ExpandMenu
        label="File"
        menuOptions={fileMenuOptions}
        isExpanded={open === "file"}
        onClickExpand={() => onClickExpand("file")}
        onClickClose={onClickClose}
      />
      <ExpandMenu
        label="View"
        menuOptions={viewMenuOptions}
        isExpanded={open === "view"}
        onClickExpand={() => onClickExpand("view")}
        onClickClose={onClickClose}
      />
      <ExpandMenu
        label="Help"
        menuOptions={helpMenuOptions}
        isExpanded={open === "help"}
        onClickExpand={() => onClickExpand("help")}
        onClickClose={onClickClose}
      />
    </Flex>
  );
}
