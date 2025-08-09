import BaseUtilitiesMenu from "./shared/BaseUtilitiesMenu";

interface EdgeUtilitiesMenuProps {
  menuOptions: Array<{
    label: string;
    // biome-ignore lint/suspicious/noExplicitAny: This is fine.
    onClickHandler: (...args: any[]) => void;
  }>;
}

export default function EdgeUtilitiesMenu({ menuOptions }: EdgeUtilitiesMenuProps) {
  return <BaseUtilitiesMenu menuOptions={menuOptions} />;
}
