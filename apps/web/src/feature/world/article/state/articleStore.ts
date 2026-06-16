import { create } from "zustand";
import { ArticleApi } from "../../../../api/article-api";
import { Article, DirectoryNode, TreeNode } from "@repo/domain";

type ArticleState = {
  articles: DirectoryNode;
  vaults: string[];
  currentArticle: Article;
  linkIndex: Record<string, string>;

  loadVaults: () => Promise<void>;
  loadArticles: (vaultId: string) => Promise<void>;
  loadArticle: (vaultId: string, path: string) => Promise<void>;
};

const buildIndex = (
  node: TreeNode,
  map: Record<string, string> = {},
  base = "",
) => {
  const path = base ? `${base}/${node.name}` : node.name;

  if (node.type === "file") {
    map[node.name.split(".md")[0]] = node.path;
  } else {
    node.children.forEach((child) => buildIndex(child, map, path));
  }

  return map;
};

export const useArticleStore = create<ArticleState>((set) => ({
  articles: { children: [], type: "folder", name: "", path: "" },
  currentArticle: { content: "", path: "", frontmatter: {} },
  vaults: [],
  linkIndex: {},

  loadVaults: async () => {
    const data = await ArticleApi.getVaults();

    set({ vaults: data });
  },

  loadArticles: async (vaultId: string) => {
    const data = await ArticleApi.getTree(vaultId);

    set({ articles: data, linkIndex: buildIndex(data) });
  },

  loadArticle: async (vaultId: string, path: string) => {
    const data = await ArticleApi.getArticle(vaultId, path);
    set({ currentArticle: data });
  },
}));
