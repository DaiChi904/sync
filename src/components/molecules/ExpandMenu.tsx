import Link from "next/link";
import PrimaryButton from "../atoms/buttons/PrimaryButton";
import SecondaryButton from "../atoms/buttons/SecondaryButton";
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
  theme?: "primary" | "secondary";
  variant?: "filled" | "text";
}

export default function ExpandMenu({
  label,
  menuOptions,
  onClickExpand,
  isExpanded,
  onClickClose,
  theme = "primary",
  variant = "filled",
}: ExpandMenuProps) {
  return (
    <Flex style={{ position: "relative" }}>
      {theme === "primary" ? (
        <PrimaryButton
          style={{ minWidth: 120, padding: 5, border: "none" }}
          variant={variant}
          animation="push"
          onClick={onClickExpand}
        >
          <Typography size="default">{label}</Typography>
        </PrimaryButton>
      ) : (
        <SecondaryButton
          style={{ minWidth: 120, padding: 5, border: "none" }}
          variant={variant}
          animation="push"
          onClick={onClickExpand}
        >
          <Typography size="default">{label}</Typography>
        </SecondaryButton>
      )}
      {isExpanded && (
        <Flex
          direction="column"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            zIndex: 10,
            minWidth: 120,
          }}
        >
          {theme === "primary"
            ? menuOptions?.map((option) => {
                return option.kind === "func" ? (
                  <PrimaryButton
                    key={option.label}
                    variant="text"
                    animation="push"
                    disabled={option.disabled}
                    style={{ padding: 5, border: "none" }}
                  >
                    <Typography onClick={option.onClick}>{option.label}</Typography>
                  </PrimaryButton>
                ) : (
                  <Link
                    key={option.label}
                    href={option.href}
                    style={{ display: "inline-flex", textDecoration: "none" }}
                  >
                    <PrimaryButton
                      variant="link"
                      animation="push"
                      disabled={option.disabled}
                      style={{ width: "100%", padding: 5, border: "none" }}
                    >
                      <Typography>{option.label}</Typography>
                    </PrimaryButton>
                  </Link>
                );
              })
            : menuOptions?.map((option) => {
                return option.kind === "func" ? (
                  <SecondaryButton
                    key={option.label}
                    variant="text"
                    animation="push"
                    disabled={option.disabled}
                    style={{ padding: 5, border: "none" }}
                  >
                    <Typography onClick={option.onClick}>{option.label}</Typography>
                  </SecondaryButton>
                ) : (
                  <Link
                    key={option.label}
                    href={option.href}
                    style={{ display: "inline-flex", textDecoration: "none" }}
                  >
                    <SecondaryButton
                      variant="link"
                      animation="push"
                      disabled={option.disabled}
                      style={{ width: "100%", padding: 5, border: "none" }}
                    >
                      <Typography>{option.label}</Typography>
                    </SecondaryButton>
                  </Link>
                );
              })}
          {theme === "primary" ? (
            <PrimaryButton
              variant="text"
              animation="push"
              style={{ padding: 5, border: "none" }}
              onClick={onClickClose}
            >
              <Typography>Close</Typography>
            </PrimaryButton>
          ) : (
            <SecondaryButton
              variant="text"
              animation="push"
              style={{ padding: 5, border: "none" }}
              onClick={onClickClose}
            >
              <Typography>Close</Typography>
            </SecondaryButton>
          )}
        </Flex>
      )}
    </Flex>
  );
}
