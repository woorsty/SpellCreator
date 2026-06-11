import path from "path";
import fs from "fs";
import type { Request, Response } from "express";
import matter from "gray-matter";

const ARTICLES_PATH = "data/articles";

type TreeNode =
  | {
      name: string;
      type: "folder";
      children: TreeNode[];
    }
  | {
      name: string;
      type: "file";
      path: string;
    };

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

    console.log(vaultId);
    const root = this.getVaultPath(vaultId);

    if (!root) {
      return res.status(404).json({ error: "Vault not found" });
    }

    const tree = await this.buildTree(root);

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
          name: entry.name,
          type: "file",
          path: entry.name,
        };
      }),
    );

    return {
      name: path.basename(dir),
      type: "folder",
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
          path: entry.name,
        };
      }),
    );

    return {
      name,
      type: "folder",
      children,
    };
  };

  public getArticle = async (req: Request, res: Response) => {
    const vaultId = req.params.vaultId as string;
    const relativePath = req.query.path as string;

    const vaultRoot = this.getVaultPath(vaultId);
    if (!vaultRoot) {
      return res.status(404).json({ error: "Vault not found" });
    }

    const resolved = path.resolve(vaultRoot, relativePath);

    if (!resolved.startsWith(path.resolve(vaultRoot))) {
      return res.status(403).json({ error: "Forbidden" });
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
