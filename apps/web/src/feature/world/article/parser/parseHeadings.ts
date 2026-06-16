export const parseHeadings = (text: string) =>
  text.replace(
    /^(#{1,6})\s(.+)$/gm,
    (_, hashes, title) => `@@H${hashes.length}:${title}@@`,
  );
