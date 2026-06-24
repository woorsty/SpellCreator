import { useState } from "react";
import { ArticleEditor } from "./ArticleEditor";
import React from "react";
import { Article } from "@repo/domain";
import { ArticleApi } from "../../../../../api/article-api";

type Props = {
  article: Article;
};

export const EditArticle: React.FC<Props> = ({ article }) => {
  const [currentArticle, setCurrentArticle] = useState(article);

  const saveArticle = async () => {
    console.log(currentArticle.content);

    ArticleApi.saveArticle(currentArticle);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <ArticleEditor
        content={article.content}
        onChange={(newValue) => {
          setCurrentArticle({ ...currentArticle, content: newValue });
        }}
      />
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={saveArticle}>
          Speichern
        </button>
      </div>
    </div>
  );
};
