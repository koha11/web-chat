import { OperationVariables, SubscribeToMoreFunction } from "@apollo/client";
import { FetchMoreFunction } from "@apollo/client/react/hooks/useSuspenseQuery";

export default interface IMyQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  subscribeToMore: SubscribeToMoreFunction<any, OperationVariables>;
  refetch: Function;
  fetchMore: FetchMoreFunction<any, OperationVariables>;
}
