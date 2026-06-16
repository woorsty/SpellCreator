import { useState } from "react";
import React from "react";
import { useLocation } from "react-router";
import styles from "../styles/article.module.css";
import { TreeNode } from "@repo/domain";

type TreeNodeProps = {
  node: TreeNode;
  onOpenArticle: (path: string) => void;
};

const normalizePath = (path: string) =>
  decodeURIComponent(path)
    .replaceAll("\\", "/")
    .replace(/\.md$/i, "")
    .toLowerCase();

const isInPath = (nodePath: string, currentPath: string) => {
  const node = normalizePath(nodePath);
  const current = normalizePath(currentPath);

  return current.startsWith(node);
};

export const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  onOpenArticle,
}) => {
  const location = useLocation();
  const currentPath = location.pathname.split("/").slice(2).join("/");
  const autoOpen = node.type === "folder" && isInPath(node.path, currentPath);
  const [isOpen, setIsOpen] = useState(autoOpen);

  const isActive =
    node.type === "file" &&
    normalizePath(currentPath) === normalizePath(node.path);

  return (
    <div>
      <button
        onClick={() =>
          node.type === "file" ? onOpenArticle(node.path) : setIsOpen((p) => !p)
        }
        className={`${styles.nodeButton} ${isActive ? styles.active : ""}`}
      >
        <span className={styles.icon}>
          {node.type === "folder" ? (isOpen ? "📂" : "📁") : "📄"}
        </span>

        <span>{node.name}</span>
      </button>

      {isOpen && node.type === "folder" && (
        <div className={styles.children}>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.name}
              node={child}
              onOpenArticle={onOpenArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
