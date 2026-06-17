import { Article } from "@repo/domain";
import React, { useEffect } from "react";
import {
  extractFirstImage,
  extractSummary,
} from "../controller/articleController";
import styles from "../styles/article.module.css";
import { useArticleStore } from "../state/articleStore";
import { ArticleApi } from "../../../../api/article-api";

type ArticlePreviewProps = {
  articlePath: string;
  onOpen: () => void;
};

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  articlePath,
  onOpen,
}) => {
  const loadArticle = useArticleStore((s) => s.loadArticle);
  const article = useArticleStore((s) => s.currentArticle);
  const [vaultId, ...pathParts] = articlePath.split("/");
  const path = pathParts.join("/");

  const loadArticles = useArticleStore((s) => s.loadArticles);
  const linkIndex = useArticleStore((s) => s.linkIndex);

  useEffect(() => {
    loadArticles(articlePath.split("/")[0]);
  }, [loadArticles, articlePath]);

  useEffect(() => {
    if (vaultId && path.endsWith(".md")) {
      loadArticle(vaultId, path);
    }
  }, [loadArticle, vaultId, path]);

  const imagePath = extractFirstImage(article.content);

  return (
    <div className={styles.preview}>
      <h3>{path.split("/").pop()?.replace(".md", "")}</h3>

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
