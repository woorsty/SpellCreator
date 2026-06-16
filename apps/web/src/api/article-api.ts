import { Article, DirectoryNode } from "@repo/domain";
import { API_BASE } from "./base";

export const ArticleApi = {
  async getVaults() {
    const result = await fetch(`${API_BASE}/article`);
    return (await result.json()) as string[];
  },

  async getTree(vault: string) {
    const res = await fetch(`${API_BASE}/article/${vault}/tree`);
    const data = (await res.json()) as DirectoryNode;

    return data;
  },

  async getArticle(vault: string, path: string) {
    const res = await fetch(`${API_BASE}/article/${vault}/${path}`);
    return (await res.json()) as Article;
  },
};
