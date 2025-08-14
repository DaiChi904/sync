import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";
import Typography from "@/components/atoms/Typography";

export default function ElementSideBar() {
  return (
    // biome-ignore lint/nursery/useUniqueElementIds: No need for unique id.
    <Flex
      id="element-side-bar"
      direction="column"
      style={{ height: "100%", padding: 5, marginRight: 10, borderRight: "1px solid #ccc" }}
    >
      <Typography>Logic gates</Typography>
      <Grid xs={1} ys={1} xfs={2} yfs={3} container style={{ marginTop: 10, gap: 2 }}>
        <Grid xs={1} ys={1} xfs={1} yfs={1} className="animated" style={{ textAlign: "center", padding: "1px" }}>
          AND
        </Grid>
        <Grid xs={1} ys={1} xfs={1} yfs={1} className="animated" style={{ textAlign: "center", padding: "1px" }}>
          ENTRY
        </Grid>
        <Grid xs={1} ys={1} xfs={1} yfs={1} className="animated" style={{ textAlign: "center", padding: "1px" }}>
          EXIT
        </Grid>
        <Grid xs={1} ys={1} xfs={1} yfs={1} className="animated" style={{ textAlign: "center", padding: "1px" }}>
          JUNCTION
        </Grid>
        <Grid xs={1} ys={1} xfs={1} yfs={1} className="animated" style={{ textAlign: "center", padding: "1px" }}>
          OR
        </Grid>
        <Grid xs={1} ys={1} xfs={1} yfs={1} className="animated" style={{ textAlign: "center", padding: "1px" }}>
          NOT
        </Grid>
      </Grid>
    </Flex>
  );
}
