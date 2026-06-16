import React from "react";
import { useArticleStore } from "../state/articleStore";
import { TreeNodeComponent } from "./TreeNodeComponent";
import { useNavigate } from "react-router";

export const ArticleSideBar: React.FC = () => {
  const articleStore = useArticleStore();
  const navigate = useNavigate();

  const openArticle = (path: string) => {
    navigate(`/article/${path}`);
  };

  return (
    <>
      <TreeNodeComponent
        node={articleStore.articles}
        onOpenArticle={openArticle}
      />
    </>
  );
};
