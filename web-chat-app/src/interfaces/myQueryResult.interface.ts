import { ApolloQueryResult, ObservableQueryFields, OperationVariables, SubscribeToMoreFunction } from "@apollo/client";
import { FetchMoreFunction } from "@apollo/client/react/hooks/useSuspenseQuery";

export default interface IMyQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  subscribeToMore: SubscribeToMoreFunction<any, OperationVariables>;
  refetch: (variables?: any) => Promise<ApolloQueryResult<any>>
  fetchMore: FetchMoreFunction<any, OperationVariables>;
}
