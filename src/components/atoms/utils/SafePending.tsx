import type { ReactNode } from "react";

interface PendingWithDataProps<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  fallback: {
    onLoading: () => ReactNode;
    onError: () => ReactNode;
  };
  children: (data: T) => ReactNode;
}

export function SafePending<T>({
  data,
  isLoading,
  isError,
  fallback: { onLoading, onError },
  children,
}: PendingWithDataProps<T>): ReactNode {
  switch (true) {
    case isLoading:
      return onLoading();
    case isError:
      return onError();
    case data !== undefined:
      return children(data);
    default:
      return null;
  }
}
