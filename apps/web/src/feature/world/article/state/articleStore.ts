import { create } from "zustand";
import { ArticleApi } from "../../../../api/article-api";
import { Article, DirectoryNode } from "@repo/domain";

type ArticleState = {
  articles: DirectoryNode;
  vaults: string[];
  currentArticle: Article;

  loadVaults: () => Promise<void>;
  loadArticles: (vaultId: string) => Promise<void>;
  loadArticle: (vaultId: string, path: string) => Promise<void>;
};

export const useArticleStore = create<ArticleState>((set) => ({
  articles: { children: [], type: "folder", name: "", path: "" },
  currentArticle: { content: "", path: "", frontmatter: {} },
  vaults: [],

  loadVaults: async () => {
    const data = await ArticleApi.getVaults();

    set({ vaults: data });
  },

  loadArticles: async (vaultId: string) => {
    const data = await ArticleApi.getTree(vaultId);

    set({ articles: data });
  },

  loadArticle: async (vaultId: string, path: string) => {
    const data = await ArticleApi.getArticle(vaultId, path);
    set({ currentArticle: data });
  },
}));
