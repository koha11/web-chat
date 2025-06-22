export default interface IModelConnection<M> {
  edges: Edge<M>[];
  pageInfo: PageInfo
}

type PageInfo = {
  startCursor: string;
  endCursor: string;
  hasNextPage: Boolean;
};

type Edge<M> = {
  node: M;
  cursor: string;
}
