export const parseImages = (text: string) =>
  text.replace(/!\[\[([^\]]+)\]\]/g, (_, match) => `@@IMG:${match}@@`);
