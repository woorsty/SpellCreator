import React, { PropsWithChildren } from "react";

type LabelProps = PropsWithChildren;

export function Label({ children }: LabelProps) {
  return <label className="text-sm font-medium text-text">{children}</label>;
}
