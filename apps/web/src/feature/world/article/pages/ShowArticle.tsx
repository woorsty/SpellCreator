import React, { useEffect, useState } from "react";
import { ArticleSideBar } from "../component/ArticleSideBar";
import { useArticleStore } from "../state/articleStore";
import { useLocation, useNavigate } from "react-router";
import styles from "../styles/article.module.css";
import { ArticleContent } from "../component/ArticleContent";
import { ArticleApi } from "../../../../api/article-api";
import { loadArticle } from "../controller/articleController";
import { Article } from "@repo/domain";
import { EditArticle } from "../component/edit/EditArticle";
import { isImagePath } from "../utls/isImagePath";

type Props = {};

export const ShowArticle: React.FC<Props> = () => {
  const location = useLocation();
  const articlePath = location.pathname;

  const navigate = useNavigate();
  const openArticle = (path: string) => {
    navigate(`/article/${path}`);
  };

  const loadArticles = useArticleStore((s) => s.loadArticles);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadArticle(articlePath).then(setCurrentArticle);
  }, [loadArticle, articlePath]);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <ArticleSideBar />
      </aside>

      <main className={styles.content}>
        {isImagePath(articlePath) ? (
          <img src={ArticleApi.getAssetUrl(`${articlePath}`)} />
        ) : currentArticle ? (
          <ArticleContent
            content={currentArticle.content}
            onOpen={(path) => openArticle(path)}
          />
        ) : (
          <EditArticle
            article={{ content: "", frontmatter: "", path: articlePath }}
          />
        )}
      </main>
    </div>
  );
};
