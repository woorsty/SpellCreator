import React, { useEffect } from "react";
import { ArticleSideBar } from "../component/ArticleSideBar";
import { useArticleStore } from "../state/articleStore";
import { useLocation, useNavigate, useParams } from "react-router";
import styles from "../styles/article.module.css";
import { ArticleContent } from "../component/ArticleContent";

type Props = {};

export const ShowArticle: React.FC<Props> = () => {
  const { vaultId } = useParams<{ vaultId: string }>();

  const location = useLocation();

  if (!vaultId) {
    return `Error 404: ${vaultId} not found`;
  }
  const articlePath = location.pathname.split(`${vaultId}/`)[1];

  const loadArticles = useArticleStore((s) => s.loadArticles);
  const loadArticle = useArticleStore((s) => s.loadArticle);
  const currentArticle = useArticleStore((s) => s.currentArticle);

  useEffect(() => {
    loadArticles(vaultId);
  }, [loadArticles, vaultId]);

  useEffect(() => {
    if (vaultId) {
      loadArticle(vaultId, articlePath);
    }
  }, [loadArticle, vaultId, articlePath]);

  const navigate = useNavigate();
  const openArticle = (path: string) => {
    navigate(`/article/${path}`);
  };

  return (
    <>
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
          ) : (
            <div>Loading article...</div>
          )}
        </main>
      </div>
    </>
  );
};
