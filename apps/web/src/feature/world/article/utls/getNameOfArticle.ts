import { Article } from "@repo/domain";

export const getNameOfArticle = (article: Article) => {
  const parts = article.path.split(".")[0].split("/");
  return parts[parts.length - 1];
};
