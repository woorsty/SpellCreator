import React from "react";
import { tokenize } from "../parser/tokenize";
import { renderToken } from "../renderer/renderToken";
import { useArticleStore } from "../state/articleStore";

type Props = {
  content: string;
  onOpen: (path: string) => void;
};
export const ArticleContent: React.FC<Props> = ({ content, onOpen }) => {
  const tokens = tokenize(content);
  const linkIndex = useArticleStore((s) => s.linkIndex);

  return (
    <div>
      {tokens.map((t, i) => (
        <React.Fragment key={i}>
          {renderToken(t, linkIndex, onOpen)}
        </React.Fragment>
      ))}
    </div>
  );
};
