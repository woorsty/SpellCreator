import { ArticleApi } from "../../../../api/article-api";

export const extractFirstImage = (content: string): string | undefined => {
  const match = content.match(/!\[\[([^|\]]+)(?:\|\d+)?\]\]/);

  return match?.[1];
};

export const extractSummary = (content: string, maxLength = 200) => {
  const cleaned = content
    .replace(/!\[\[.*?\]\]/g, "")
    .replace(/\[\[(.*?)\]\]/g, "$1")
    .replace(/^#+\s/gm, "")
    .replace(/\n+/g, " ")
    .trim();

  return cleaned.slice(0, maxLength) + "...";
};

export const resolveArticleFromMap = (
  linkIndex: Record<string, string>,
  markerName: string,
) => {
  if (linkIndex[markerName]) {
    return linkIndex[markerName];
  }

  return null;
};

export const loadArticle = async (path: string) => {
  const data = await ArticleApi.getArticle(path);
  return data;
};
