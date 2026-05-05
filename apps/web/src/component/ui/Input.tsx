// components/ui/Input.tsx
import React from "react";
import "./input.css";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="input" />;
}
