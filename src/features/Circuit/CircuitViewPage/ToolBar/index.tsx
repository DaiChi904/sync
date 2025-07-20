import Link from "next/link";
import Flex from "@/components/atoms/Flex";
import Grid from "@/components/atoms/Grid";

export default function ToolBar() {
  return (
    <Grid xs={1} ys={1} xfs={3} yfs={1} container style={{ alignItems: "center", borderBottom: "1px solid #ccc" }}>
      <Grid xs={1} ys={1} xfs={1} yfs={1} style={{ justifyItems: "center" }}>
        <Link style={{ display: "block", textDecoration: "none", color: "inherit", width: "100%" }} href={""}>
          <Flex style={{ padding: 5 }} className="animated">
            File (Not Available)
          </Flex>
        </Link>
      </Grid>
      <Grid xs={1} ys={1} xfs={1} yfs={1} style={{ justifyItems: "center" }}>
        <Link style={{ display: "block", textDecoration: "none", color: "inherit", width: "100%" }} href={""}>
          <Flex style={{ padding: 5 }} className="animated">
            Go edit (Not Available)
          </Flex>
        </Link>
      </Grid>
      <Grid xs={1} ys={1} xfs={1} yfs={1} style={{ justifyItems: "center" }}>
        <Link style={{ display: "block", textDecoration: "none", color: "inherit", width: "100%" }} href={""}>
          <Flex style={{ padding: 5 }} className="animated">
            Go Emulate (Not Available)
          </Flex>
        </Link>
      </Grid>
    </Grid>
  );
}
