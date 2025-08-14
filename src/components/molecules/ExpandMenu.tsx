import Link from "next/link";
import Flex from "../atoms/Flex";
import Typography from "../atoms/Typography";

interface ExpandMenuProps {
  label: string;
  menuOptions: Array<
    // biome-ignore lint/suspicious/noExplicitAny: This is fine.
    | { label: string; kind: "func"; onClick: (...args: any[]) => void; disabled?: boolean }
    | { label: string; kind: "link"; href: string; disabled?: boolean }
  >;
  onClickExpand: () => void;
  isExpanded: boolean;
  onClickClose: () => void;
}

export default function ExpandMenu({ label, menuOptions, onClickExpand, isExpanded, onClickClose }: ExpandMenuProps) {
  return (
    <Flex style={{ position: "relative" }}>
      <Flex onClick={onClickExpand} className="animated" style={{ cursor: "pointer", minWidth: 100 }}>
        <Typography size="default">{label}</Typography>
      </Flex>
      {isExpanded && (
        <Flex
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 10,
            flexDirection: "column",
            minWidth: "100px",
          }}
        >
          {menuOptions?.map((option) => {
            return option.kind === "func" ? (
              <Flex
                key={option.label}
                className="animated"
                style={{ color: option.disabled ? `#ccc` : "", cursor: "pointer" }}
              >
                <Typography onClick={option.onClick} style={{ textDecoration: "none", color: "black" }}>
                  {option.label}
                </Typography>
              </Flex>
            ) : (
              <Flex
                key={option.label}
                className="animated"
                style={{ color: option.disabled ? `#ccc` : "", cursor: "pointer" }}
              >
                <Link href={option.href} style={{ textDecoration: "none", color: "black" }}>
                  <Typography>{option.label}</Typography>
                </Link>
              </Flex>
            );
          })}
          <Flex className="animated" style={{ cursor: "pointer" }} onClick={onClickClose}>
            <Typography>Close</Typography>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
