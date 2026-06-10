import React, { DetailedHTMLProps, PropsWithChildren } from "react";

type CardProps = PropsWithChildren &
  DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function Card(props: CardProps) {
  return (
    <div
      className="rounded-xl border border-border bg-surface p-4 shadow-sm"
      {...props}
    >
      {props.children}
    </div>
  );
}
