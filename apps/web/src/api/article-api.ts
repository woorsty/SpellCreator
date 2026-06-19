import { Article, DirectoryNode } from "@repo/domain";
import { API_BASE } from "./base";

export const ArticleApi = {
  async getVaults() {
    const result = await fetch(`${API_BASE}/article`);
    return (await result.json()) as string[];
  },

  async getTree(vaultId?: string) {
    const url = vaultId
      ? `${API_BASE}/article/${vaultId}/tree`
      : `${API_BASE}/article/tree`;
    const res = await fetch(url);
    const data = (await res.json()) as DirectoryNode;

    return data;
  },

  async getArticle(vaultId: string, path: string) {
    const res = await fetch(`${API_BASE}/article/${vaultId}/${path}`);
    if (res.status === 404) {
      return null;
    }
    return (await res.json()) as Article;
  },

  getAssetUrl(path: string) {
    return `${API_BASE}/article/${path}`;
  },
};
