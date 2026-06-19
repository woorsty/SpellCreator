import { create } from "zustand";
import { ArticleApi } from "../../../../api/article-api";
import { Article, DirectoryNode, FileNode, TreeNode } from "@repo/domain";

const PLACES_VAULT_ID = "Places";

type ArticleState = {
  articles: DirectoryNode;
  flatArticles: FileNode[];
  vaults: string[];
  linkIndex: Record<string, string>;
  places: FileNode[];

  loadVaults: () => Promise<void>;
  loadArticles: (vaultId?: string) => Promise<void>;
  loadPlaces: () => Promise<void>;
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

const getFlatArticles = (node: TreeNode, list: FileNode[] = []) => {
  if (node.type === "file") {
    list.push(node);
  } else {
    node.children.forEach((child) => getFlatArticles(child, list));
  }

  return list;
};

export const useArticleStore = create<ArticleState>((set) => ({
  articles: { children: [], type: "folder", name: "", path: "" },
  vaults: [],
  linkIndex: {},
  flatArticles: [],
  places: [],

  loadVaults: async () => {
    const data = await ArticleApi.getVaults();

    set({ vaults: data });
  },

  loadArticles: async (vaultId?: string) => {
    const data = await ArticleApi.getTree(vaultId);

    set({
      articles: data,
      linkIndex: buildIndex(data),
      flatArticles: getFlatArticles(data),
    });
  },

  loadPlaces: async () => {
    const data = await ArticleApi.getTree(PLACES_VAULT_ID);
    const places = getFlatArticles(data);

    set({
      places,
    });
  },
}));
