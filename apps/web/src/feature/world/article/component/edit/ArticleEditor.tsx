import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame-dark.css";

import React from "react";
import { Article } from "@repo/domain";

type Props = {
  content: string;
  onChange: (newValue: string) => void;
};

export const ArticleEditor: React.FC<Props> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const crepe = new Crepe({
      root: editorRef.current,
      defaultValue: content,
    });
    crepe.on((listener) =>
      listener.markdownUpdated((ctx, markdown, prevMarkdown) =>
        onChange(markdown),
      ),
    );

    crepe.create();

    crepeRef.current = crepe;

    return () => {
      crepe.destroy();
      crepeRef.current = null;
    };
  }, []);

  return <div ref={editorRef} />;
};
