import type { ComponentProps } from "react";

interface TableProps extends ComponentProps<"table"> {}

export function Table({ children, ...props }: TableProps) {
  return <table {...props}>{children}</table>;
}

interface TableCaptionProps extends ComponentProps<"caption"> {}

export function TableCaption({ children, ...props }: TableCaptionProps) {
  return <caption {...props}>{children}</caption>;
}

interface TableHeadProps extends ComponentProps<"thead"> {}

export function TableHead({ children, ...props }: TableHeadProps) {
  return <thead {...props}>{children}</thead>;
}

interface TableBodyProps extends ComponentProps<"tbody"> {}

export function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>;
}

interface TableFootProps extends ComponentProps<"tfoot"> {}

export function TableFoot({ children, ...props }: TableFootProps) {
  return <tfoot {...props}>{children}</tfoot>;
}

interface TableRowProps extends ComponentProps<"tr"> {}

export function TableRow({ children, ...props }: TableRowProps) {
  return <tr {...props}>{children}</tr>;
}

interface TableCellProps extends ComponentProps<"td"> {}

export function TableCell({ children, ...props }: TableCellProps) {
  return <td {...props}>{children}</td>;
}

interface TableHeaderCellProps extends ComponentProps<"th"> {}

export function TableHeaderCell({ children, ...props }: TableHeaderCellProps) {
  return <th {...props}>{children}</th>;
}
