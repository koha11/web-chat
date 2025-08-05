export const arraysEqualUnordered = (a: any, b: any) => {
  if (a.length !== b.length) return false;
  return [...a].sort().every((val, index) => val === [...b].sort()[index]);
};
