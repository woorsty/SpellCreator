export type DirectoryNode = {
  name: string;
  type: "folder";
  children: TreeNode[];
  path: string;
};

export type FileNode = {
  name: string;
  type: "file";
  path: string;
};

export type TreeNode = DirectoryNode | FileNode;
