import path from "path";
import fs from "fs";
import type { Request, Response } from "express";
import matter from "gray-matter";
import { Article, TreeNode } from "@repo/domain";

const ARTICLES_PATH = "data/articles";

export class ArticleController {
  private getVaultNames = () => {
    return fs
      .readdirSync(ARTICLES_PATH, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dir) => dir.name);
  };

  private getVaultPath = (vaultId: string) => {
    return path.join(ARTICLES_PATH, vaultId);
  };

  public getVaults = async (req: Request, res: Response) => {
    res.json(this.getVaultNames());
  };

  public getVaultTree = async (req: Request, res: Response) => {
    const vaultId = req.params.vaultId as string;

    const root = this.getVaultPath(vaultId);

    if (!root) {
      return res.status(404).json({ error: "Vault not found" });
    }

    const tree = await this.buildTree(root);

    res.json(tree);
  };

  public getFullTree = async (req: Request, res: Response) => {
    const tree = await this.buildTree(ARTICLES_PATH);
    res.json(tree);
  };

  private buildTree = async (dir: string): Promise<TreeNode> => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const children: TreeNode[] = await Promise.all(
      entries.map(async (entry): Promise<TreeNode> => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          return this.buildFolder(entry.name, fullPath);
        }

        return {
          name: entry.name.split(".")[0],
          type: "file",
          path: fullPath.split(path.sep).slice(2).join(path.sep),
        };
      }),
    );

    return {
      name: path.basename(dir),
      type: "folder",
      path: path.join(dir).split(path.sep).slice(2).join(path.sep),
      children,
    };
  };

  private buildFolder = async (
    name: string,
    dir: string,
  ): Promise<TreeNode> => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const children: TreeNode[] = await Promise.all(
      entries.map(async (entry): Promise<TreeNode> => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          return this.buildFolder(entry.name, fullPath);
        }

        return {
          name: entry.name,
          type: "file",
          path: fullPath.split(path.sep).slice(2).join(path.sep),
        };
      }),
    );

    return {
      name,
      type: "folder",
      path: dir.split(path.sep).slice(2).join(path.sep),
      children,
    };
  };

  public getArticle = async (req: Request, res: Response) => {
    const vaultId = req.params.vaultId as string;
    const relativePath = Array.isArray(req.params.path)
      ? req.params.path.join("/")
      : req.params.path;

    const vaultRoot = this.getVaultPath(vaultId);
    if (!vaultRoot) {
      return res.status(404).json({ error: "Vault not found" });
    }

    let resolved = path.resolve(vaultRoot, relativePath);

    if (!resolved.includes(".")) {
      resolved += ".md";
    }

    if (!resolved.startsWith(path.resolve(vaultRoot))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const ext = path.extname(resolved).toLowerCase();
    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

    if (imageExtensions.includes(ext)) {
      return res.sendFile(resolved);
    }

    if (!fs.existsSync(resolved)) {
      res.status(404);
      return;
    }

    const raw = fs.readFileSync(resolved, "utf-8");

    const parsed = matter(raw);

    res.json({
      path: relativePath,
      content: parsed.content,
      frontmatter: parsed.data,
    });
  };

  public search = async (req: Request, res: Response) => {
    const vaultId = req.params.vaultId as string;
    const q = (req.query.q as string)?.toLowerCase();

    if (!q) {
      return res.json([]);
    }

    const vaultRoot = this.getVaultPath(vaultId);
    if (!vaultRoot) {
      return res.status(404).json({ error: "Vault not found" });
    }

    const files = await this.collectFiles(vaultRoot);

    const results = [];

    for (const file of files) {
      const raw = fs.readFileSync(file, "utf-8");
      const parsed = matter(raw);

      const relativePath = path.relative(vaultRoot, file);
      const filename = path.basename(file).toLowerCase();

      const content = parsed.content.toLowerCase();

      const matches = filename.includes(q) || content.includes(q);

      if (matches) {
        results.push({
          name: path.basename(file),
          path: relativePath,
          snippet: this.getSnippet(parsed.content, q),
        });
      }
    }

    res.json(results);
  };

  public write = (req: Request, res: Response) => {
    const article = req.body as Article;

    const data = this.createArticleFromJson(article);
    fs.writeFileSync(ARTICLES_PATH + "/" + article.path, data);

    res.json({ ok: true });
  };

  private createArticleFromJson = (article: Article) => {
    let data = "";
    if (article.frontmatter) {
      data += `---\n${this.createFrontmatter(article.frontmatter)}---\n\n`;
    }
    data += article.content;

    return data;
  };

  private createFrontmatter = (frontmatter: any): string => {
    let result = "";

    Object.keys(frontmatter).forEach((key) => {
      result += key + ":";
      if (Array.isArray(frontmatter[key])) {
        result += "\n";
        frontmatter[key].forEach((value) => {
          result += `  - ${value}\n`;
        });
      } else {
        result += frontmatter[key] + "\n";
      }
    });

    return result;
  };

  private collectFiles = async (dir: string): Promise<string[]> => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          return this.collectFiles(fullPath);
        }

        if (entry.name.endsWith(".md")) {
          return [fullPath];
        }

        return [];
      }),
    );

    return files.flat();
  };

  private getSnippet = (content: string, query: string) => {
    const index = content.toLowerCase().indexOf(query.toLowerCase());

    if (index === -1) return "";

    const start = Math.max(0, index - 60);
    const end = Math.min(content.length, index + 60);

    return content.slice(start, end).replace(/\n/g, " ");
  };
}
