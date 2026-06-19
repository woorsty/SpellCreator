import { Article } from "@repo/domain";
import React from "react";
import {
  extractFirstImage,
  extractSummary,
} from "../controller/articleController";
import styles from "../styles/article.module.css";
import { useArticleStore } from "../state/articleStore";
import { ArticleApi } from "../../../../api/article-api";

type ArticlePreviewProps = {
  article: Article;
  onOpen: () => void;
};

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
  onOpen,
}) => {
  const linkIndex = useArticleStore((s) => s.linkIndex);

  if (!article) {
    return "Loading Article";
  }

  const imagePath = extractFirstImage(article.content);

  return (
    <div className={styles.preview}>
      <h3>{article.path.split(".md")[0]}</h3>

      {imagePath && (
        <img
          src={ArticleApi.getAssetUrl(`${linkIndex[imagePath]}`)}
          className={styles.previewImage}
        />
      )}

      <p>{extractSummary(article.content)}</p>

      <button className={styles.previewButton} onClick={onOpen}>
        Artikel öffnen
      </button>
    </div>
  );
};
