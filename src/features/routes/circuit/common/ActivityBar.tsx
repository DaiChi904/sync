import PrimaryButton from "@/components/atoms/buttons/PrimaryButton";
import Grid from "@/components/atoms/Grid";

interface ActivityBarProps {
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  menuOptions?: Array<{ label: string; onClick: (...args: any[]) => void }>;
}

export default function ActivityBar({ menuOptions }: ActivityBarProps) {
  const menuOptionAmount = menuOptions?.length;
  return (
    <Grid container yfs={menuOptionAmount} grow={1}>
      {menuOptions?.map((option) => (
        <PrimaryButton
          key={option.label}
          onClick={option.onClick}
          variant="text"
          animation="slide"
          style={{ border: "none" }}
        >
          {option.label}
        </PrimaryButton>
      ))}
    </Grid>
  );
}
