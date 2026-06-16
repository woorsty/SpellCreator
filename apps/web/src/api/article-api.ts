import { Article, DirectoryNode } from "@repo/domain";
import { API_BASE } from "./base";

export const ArticleApi = {
  async getVaults() {
    const result = await fetch(`${API_BASE}/article`);
    return (await result.json()) as string[];
  },

  async getTree(vaultId: string) {
    const res = await fetch(`${API_BASE}/article/${vaultId}/tree`);
    const data = (await res.json()) as DirectoryNode;

    return data;
  },

  async getArticle(vaultId: string, path: string) {
    const res = await fetch(`${API_BASE}/article/${vaultId}/${path}`);
    return (await res.json()) as Article;
  },

  getAssetUrl(path: string) {
    return `${API_BASE}/article/${path}`;
  },
};
