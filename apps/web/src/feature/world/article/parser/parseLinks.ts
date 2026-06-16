export const parseLinks = (text: string) =>
  text.replace(/\[\[([^\]]+)\]\]/g, (_, match) => `@@LINK:${match}@@`);
