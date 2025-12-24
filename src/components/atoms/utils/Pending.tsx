import type { ReactNode } from "react";

interface PendingProps {
  isLoading: boolean;
  isError: boolean;
  fallback: {
    onLoading: () => ReactNode;
    onError: () => ReactNode;
  };
  children?: ReactNode;
}

export default function Pending({
  isLoading,
  isError,
  fallback: { onLoading, onError },
  children,
}: PendingProps): ReactNode {
  switch (true) {
    case isLoading:
      return onLoading();
    case isError:
      return onError();
    default:
      return children;
  }
}
