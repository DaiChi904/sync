import type { ComponentProps } from "react";

interface TextareaProps extends ComponentProps<"textarea"> {}

export default function Textarea({ ...props }: TextareaProps) {
  return <textarea {...props} />;
}
