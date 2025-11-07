import OnClickEventBackdrop from "./baseLayers/onClickEventBackdrop";

interface DiagramUtilityMenuBackdropProps {
  id?: string;
  viewBoxX?: number;
  viewBoxY?: number;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onClick?: (...args: any[]) => void;
}

export default function DiagramUtilityMenuBackdrop({
  id,
  viewBoxX,
  viewBoxY,
  onClick,
}: DiagramUtilityMenuBackdropProps) {
  return <OnClickEventBackdrop id={id} viewBoxX={viewBoxX} viewBoxY={viewBoxY} onClick={onClick} />;
}
