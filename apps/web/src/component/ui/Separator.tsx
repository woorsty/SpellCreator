import React from "react";

export function Separator({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={`my-4 border-border ${className}`}
      {...props}
    />
  );
}
