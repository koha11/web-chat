export const getDisplayFileSize = (size: number) => {
  let n = size / 1024;

  if (n < 1000) return `${n.toFixed(2)} KB`;

  n = size / (1024 * 1024);

  if (n < 1000) return `${n.toFixed(2)} MB`;

  return `${size} B`;
};
