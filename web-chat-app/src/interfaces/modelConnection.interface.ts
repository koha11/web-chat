export default interface IModelConnection<M> {
  edges: Edge<M>[];
  pageInfo: PageInfo;
}

export type PageInfo = {
  startCursor?: string;
  endCursor?: string;
  hasNextPage: Boolean;
};

export type Edge<M> = {
  node: M;
  cursor: string;
};
