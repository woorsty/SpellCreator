import React, { PropsWithChildren } from "react";

type CardProps = PropsWithChildren;

export function Card({ children }: CardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      {children}
    </div>
  );
}
