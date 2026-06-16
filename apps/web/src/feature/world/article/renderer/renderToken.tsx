import React from "react";
import { JSX } from "react";
import { ArticleApi } from "../../../../api/article-api";

export const renderToken = (
  token: string,
  linkIndex: Record<string, string>,
  onOpen: (p: string) => void,
) => {
  if (token.startsWith("@@LINK:")) {
    const value = token.replace("@@LINK:", "").replace(/@@/g, "");
    const alias = value.split("\|")[1];

    return (
      <span
        onClick={() => {
          const [target, anchor] = value.split("\|")[0].split("#");
          const resolvedLink =
            `${linkIndex[target]}` + (anchor ? `#${anchor}` : "");
          if (!resolvedLink) {
            console.warn("Unknown Link:", value);
            return;
          }
          onOpen(resolvedLink);
        }}
        style={{ color: "#4aa3ff", cursor: "pointer" }}
      >
        {alias || value}
      </span>
    );
  }

  if (token.startsWith("@@IMG:")) {
    const value = token.replace("@@IMG:", "").replace(/@@/g, "");
    const [src, size] = value.split("|");
    const resolvedLink = `${linkIndex[src]}`;
    console.log(src, resolvedLink, linkIndex);

    return (
      <img
        src={ArticleApi.getAssetUrl(resolvedLink)}
        style={{ maxWidth: size ? `${size}px` : "100%" }}
      />
    );
  }

  if (token.startsWith("@@H")) {
    const [, level, title] = token.match(/@@H(\d):(.*?)@@/) || [];

    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return <Tag>{title}</Tag>;
  }

  if (token.startsWith("@@BR")) {
    return <br />;
  }

  return <span>{token}</span>;
};
