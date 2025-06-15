export const isArray = (data: any): boolean => {
  if (typeof data == "object") return true;

  return false;
};
