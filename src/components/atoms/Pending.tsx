import { Suspense } from "react";

interface PendingPropsBase {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  error?: boolean;
  onFailure?: React.ReactNode;
}

interface PendingAsyncProps extends PendingPropsBase {
  async: true;
}

interface PendingSyncProps extends PendingPropsBase {
  async?: false;
  isLoading?: boolean;
}

type PendingProps = PendingAsyncProps | PendingSyncProps;

export default function Pending(props: PendingProps) {
  if (props.async) {
    return <Suspense fallback={props.fallback}>{props.error ? props.onFailure : props.children}</Suspense>;
  }

  if (props.isLoading) return <>{props.fallback}</>;
  if (props.error) return <>{props.onFailure}</>;
  return <>{props.children}</>;
}
