import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import BaseUtilityMenu from "./BaseUtilityMenu";

interface NodeUtilityMenuProps {
  at: Coordinate;
  menuOptions: Array<{
    label: string;
    // biome-ignore lint/suspicious/noExplicitAny: This is fine.
    onClickHandler: (...args: any[]) => void;
  }>;
}

export default function NodeUtilityMenu({ at, menuOptions }: NodeUtilityMenuProps) {
  return <BaseUtilityMenu at={at} menuOptions={menuOptions} />;
}
