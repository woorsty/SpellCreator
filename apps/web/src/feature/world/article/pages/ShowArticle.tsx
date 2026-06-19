import React, { useEffect, useState } from "react";
import { ArticleSideBar } from "../component/ArticleSideBar";
import { useArticleStore } from "../state/articleStore";
import { useLocation, useNavigate, useParams } from "react-router";
import styles from "../styles/article.module.css";
import { ArticleContent } from "../component/ArticleContent";
import { ArticleApi } from "../../../../api/article-api";
import { loadArticle } from "../controller/articleController";
import { Article } from "@repo/domain";

type Props = {};

export const ShowArticle: React.FC<Props> = () => {
  const { vaultId } = useParams<{ vaultId: string }>();

  const location = useLocation();

  if (!vaultId) {
    return `Error 404: ${vaultId} not found`;
  }
  const articlePath = location.pathname.split(`${vaultId}/`)[1];

  const navigate = useNavigate();
  const openArticle = (path: string) => {
    navigate(`/article/${path}`);
  };

  const loadArticles = useArticleStore((s) => s.loadArticles);

  useEffect(() => {
    loadArticles(vaultId);
  }, [loadArticles, vaultId]);

  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (vaultId && articlePath.endsWith(".md")) {
      loadArticle(vaultId, articlePath).then(setCurrentArticle);
    }
  }, [loadArticle, vaultId, articlePath]);

  console.log(articlePath);
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <ArticleSideBar />
      </aside>

      <main className={styles.content}>
        {currentArticle?.content ? (
          <ArticleContent
            content={currentArticle.content}
            onOpen={(path) => openArticle(path)}
          />
        ) : !articlePath.endsWith(".md") ? (
          <img src={ArticleApi.getAssetUrl(`${vaultId}/${articlePath}`)} />
        ) : (
          <div>Loading article...</div>
        )}
      </main>
    </div>
  );
};
