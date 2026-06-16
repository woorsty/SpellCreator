import { parseHeadings } from "./parseHeadings";
import { parseImages } from "./parseImages";
import { parseLinks } from "./parseLinks";

export const tokenize = (input: string) => {
  let text = input;

  text = parseImages(text);
  text = parseLinks(text);
  text = parseHeadings(text);

  return text.split(/(@@.*?@@)/g).filter(Boolean);
};
