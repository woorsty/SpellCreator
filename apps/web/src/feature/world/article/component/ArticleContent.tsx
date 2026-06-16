import React from "react";
import { tokenize } from "../parser/tokenize";
import { renderToken } from "../renderer/renderToken";

type Props = {
  content: string;
  onOpen: (path: string) => void;
};
export const ArticleContent: React.FC<Props> = ({ content, onOpen }) => {
  const tokens = tokenize(content);

  return (
    <div>
      {tokens.map((t, i) => (
        <React.Fragment key={i}>{renderToken(t, onOpen)}</React.Fragment>
      ))}
    </div>
  );
};
