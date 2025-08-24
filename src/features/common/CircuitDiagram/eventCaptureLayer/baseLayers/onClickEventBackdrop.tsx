interface OnClickEventBackdropProps {
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onClick?: (...args: any[]) => void;
}

export default function OnClickEventBackdrop({ onClick }: OnClickEventBackdropProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
    <rect x={0} y={0} width="100%" height="100%" fill="transparent" pointerEvents="all" onClick={onClick} />
  );
}
