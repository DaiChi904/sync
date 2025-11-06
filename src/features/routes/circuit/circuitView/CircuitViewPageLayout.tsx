import type { ComponentProps } from "react";
import Flex from "@/components/atoms/Flex";
import LoadingPuls from "@/components/atoms/LoadingPuls";
import Pending from "@/components/atoms/Pending";
import Typography from "@/components/atoms/Typography";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/atoms/table";
import LayoutContainer from "@/components/layouts/LayoutContainer";
import { useCircuitViewPageHandlerContext } from "@/contexts/CircuitViewPageHandlerContext";
import CircuitDiagram from "../../../common/circuitDiagram";
import BaseCircuitPageLayout from "../common/BaseCircuitPageLayout";

export default function CircuitViewPageLayout() {
  const { error, uiState, overview, guiData, openToolBarMenu, closeToolBarMenu, changeActivityBarMenu } =
    useCircuitViewPageHandlerContext();

  const isInError = error.failedToGetCircuitDetailError || error.failedToParseCircuitDataError;

  const toolBarOptions: ComponentProps<typeof BaseCircuitPageLayout>["toolBarOptions"] = [
    {
      label: "File",
      menuOptions: [{ label: "Close Circuit", kind: "link", href: "/" }],
      isExpanded: uiState.toolBarMenu.open === "file",
      onClickExpand: () => openToolBarMenu("file"),
      onClickClose: () => closeToolBarMenu(),
    },
    {
      label: "View",
      menuOptions: [],
      isExpanded: uiState.toolBarMenu.open === "view",
      onClickExpand: () => openToolBarMenu("view"),
      onClickClose: () => closeToolBarMenu(),
    },
    {
      label: "Go to",
      menuOptions: [
        { label: "Edit", kind: "link", href: `/circuit/${overview?.id}/edit` },
        { label: "Emulation", kind: "link", href: `/circuit/${overview?.id}/emulation` },
      ],
      isExpanded: uiState.toolBarMenu.open === "goTo",
      onClickExpand: () => openToolBarMenu("goTo"),
      onClickClose: () => closeToolBarMenu(),
    },
    {
      label: "Help",
      menuOptions: [],
      isExpanded: uiState.toolBarMenu.open === "help",
      onClickExpand: () => openToolBarMenu("help"),
      onClickClose: () => closeToolBarMenu(),
    },
  ];
  const activityBarOptions: ComponentProps<typeof BaseCircuitPageLayout>["activityBarOptions"] = [
    { label: "Infomaiton", onClick: () => changeActivityBarMenu("infomation") },
    { label: "Circuit Diagram", onClick: () => changeActivityBarMenu("circuitDiagram") },
  ];

  return (
    <LayoutContainer>
      <BaseCircuitPageLayout toolBarOptions={toolBarOptions} activityBarOptions={activityBarOptions}>
        <Flex direction="column" alignItems="center" justifyContent="center" grow={1}>
          <Pending
            isLoading={!overview && !isInError}
            fallback={<LoadingPuls />}
            error={isInError}
            onFailure={<Typography>Failed to load circuit data.</Typography>}
          >
            {(() => {
              switch (uiState.activityBarMenu.open) {
                case "infomation": {
                  return (
                    <Flex direction="column" grow={1} style={{ height: "100%", width: "100%", padding: 20 }}>
                      <Typography size="superLarge">Infomation</Typography>
                      <Flex>
                        <Flex direction="column" basis="60%" style={{ padding: 10 }}>
                          <Typography size="huge">{overview?.title}</Typography>
                          <Typography size="medium">{overview?.description}</Typography>
                        </Flex>
                        <Flex direction="column" basis="40%" style={{ padding: 10, minWidth: "450px" }}>
                          <Table>
                            <TableCaption>
                              <Typography size="medium" style={{ paddingLeft: 20, textAlign: "start" }}>
                                Property
                              </Typography>
                            </TableCaption>
                            <TableBody>
                              <TableRow>
                                <TableCell style={{ padding: "8px 20px" }}>
                                  <Typography size="defaultPlus">ID</Typography>
                                </TableCell>
                                <TableCell style={{ padding: "8px 20px" }}>
                                  <Typography size="defaultPlus">{overview?.id}</Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell style={{ padding: "8px 20px" }}>
                                  <Typography size="defaultPlus">Created At</Typography>
                                </TableCell>
                                <TableCell style={{ padding: "8px 20px" }}>
                                  <Typography size="defaultPlus">{overview?.createdAt}</Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell style={{ padding: "8px 20px" }}>
                                  <Typography size="defaultPlus">Updated At</Typography>
                                </TableCell>
                                <TableCell style={{ padding: "8px 20px" }}>
                                  <Typography size="defaultPlus">{overview?.updatedAt}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Flex>
                      </Flex>
                    </Flex>
                  );
                }
                case "circuitDiagram": {
                  return (
                    <Flex
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      grow={1}
                      style={{ height: "100%", width: "100%", background: "var(--color-circuit-diagram-bg)" }}
                    >
                      <CircuitDiagram
                        // biome-ignore lint/style/noNonNullAssertion: guiData is guaranteed to be present when isLoading is false
                        data={guiData!}
                      />
                    </Flex>
                  );
                }
              }
            })()}
          </Pending>
        </Flex>
      </BaseCircuitPageLayout>
    </LayoutContainer>
  );
}
