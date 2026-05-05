import React from "react";
import "./button.css";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="button" />;
}
