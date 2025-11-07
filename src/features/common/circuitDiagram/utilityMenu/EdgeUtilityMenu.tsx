import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import BaseUtilityMenu from "./BaseUtilityMenu";

interface EdgeUtilityMenuProps {
  at: Coordinate;
  menuOptions: Array<{
    label: string;
    // biome-ignore lint/suspicious/noExplicitAny: This is fine.
    onClickHandler: (...args: any[]) => void;
  }>;
}

export default function EdgeUtilityMenu({ at, menuOptions }: EdgeUtilityMenuProps) {
  return <BaseUtilityMenu at={at} menuOptions={menuOptions} />;
}
