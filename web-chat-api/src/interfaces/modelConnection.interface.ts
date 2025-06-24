export default interface IModelConnection<M> {
  edges: Edge<M>[];
  pageInfo: PageInfo;
}

export type PageInfo = {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: Boolean;
};

export type Edge<M> = {
  node: M;
  cursor: string;
};
