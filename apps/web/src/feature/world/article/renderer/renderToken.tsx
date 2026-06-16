import React from "react";
import { JSX } from "react";

export const renderToken = (token: string, onOpen: (p: string) => void) => {
  if (token.startsWith("@@LINK:")) {
    const value = token.replace("@@LINK:", "").replace(/@@/g, "");

    return (
      <span
        onClick={() => onOpen(value)}
        style={{ color: "#4aa3ff", cursor: "pointer" }}
      >
        {value}
      </span>
    );
  }

  if (token.startsWith("@@IMG:")) {
    const value = token.replace("@@IMG:", "").replace(/@@/g, "");
    const [src, size] = value.split("|");

    return <img src={src} style={{ maxWidth: size ? `${size}px` : "100%" }} />;
  }

  if (token.startsWith("@@H")) {
    const [, level, title] = token.match(/@@H(\d):(.*?)@@/) || [];

    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return <Tag>{title}</Tag>;
  }

  return <span>{token}</span>;
};
