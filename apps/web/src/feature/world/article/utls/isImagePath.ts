const imageFiles = ["png", "jpg", "jpeg"];

export const isImagePath = (articlePath: string) => {
  const result = imageFiles.filter((fileType) =>
    articlePath.endsWith(`.${fileType}`),
  );
  return result.length > 0;
};
