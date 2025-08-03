export const strimText = (text: String, maxLength: number) => {
  let res = text.slice(0, maxLength);

  if (text.length > maxLength) res += "...";

  return res;
};
