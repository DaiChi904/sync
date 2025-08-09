import BaseUtilitiesMenu from "./shared/BaseUtilitiesMenu";

interface NodeUtilitiesMenuProps {
  menuOptions: Array<{
    label: string;
    // biome-ignore lint/suspicious/noExplicitAny: This is fine.
    onClickHandler: (...args: any[]) => void;
  }>;
}

export default function NodeUtilitiesMenu({ menuOptions }: NodeUtilitiesMenuProps) {
  return <BaseUtilitiesMenu menuOptions={menuOptions} />;
}
