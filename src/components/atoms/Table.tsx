import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children?: ReactNode;
}

export function Table({ children, ...props }: TableProps) {
  return <table {...props}>{children}</table>;
}

interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
  children?: ReactNode;
}

export function TableCaption({ children, ...props }: TableCaptionProps) {
  return <caption {...props}>{children}</caption>;
}

interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export function TableHead({ children, ...props }: TableHeadProps) {
  return <thead {...props}>{children}</thead>;
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>;
}

interface TableFootProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

export function TableFoot({ children, ...props }: TableFootProps) {
  return <tfoot {...props}>{children}</tfoot>;
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode;
}

export function TableRow({ children, ...props }: TableRowProps) {
  return <tr {...props}>{children}</tr>;
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export function TableCell({ children, ...props }: TableCellProps) {
  return <td {...props}>{children}</td>;
}

interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
}

export function TableHeaderCell({ children, ...props }: TableHeaderCellProps) {
  return <th {...props}>{children}</th>;
}
