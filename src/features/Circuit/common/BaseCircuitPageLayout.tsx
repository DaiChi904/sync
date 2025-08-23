import type { ComponentProps, ReactNode } from "react";
import Flex from "@/components/atoms/Flex";
import ActivityBar from "./ActivityBar";
import ToolBar from "./ToolBar";

interface BaseCircuitPageLayoutProps {
  toolBarOptions?: ComponentProps<typeof ToolBar>["menuOptions"];
  activityBarOptions?: ComponentProps<typeof ActivityBar>["menuOptions"];
  children?: ReactNode;
}

export default function BaseCircuitPageLayout({
  toolBarOptions,
  activityBarOptions,
  children,
}: BaseCircuitPageLayoutProps) {
  return (
    <Flex direction="column" grow={1}>
      <ToolBar menuOptions={toolBarOptions} />
      <Flex direction="row" grow={1}>
        <Flex basis="100px">
          <ActivityBar menuOptions={activityBarOptions} />
        </Flex>
        <Flex direction="column" grow={1}>
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
