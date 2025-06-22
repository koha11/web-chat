export default interface IModelConnection<M> {
  edges: Edge<M>[];
  pageInfo: PageInfo;
}

type PageInfo = {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: Boolean;
};

type Edge<M> = {
  node: M;
  cursor: string;
};
