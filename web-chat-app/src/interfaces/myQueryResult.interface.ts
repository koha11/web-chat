import { OperationVariables, SubscribeToMoreFunction } from "@apollo/client";

export default interface IMyQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  subscribeToMore: SubscribeToMoreFunction<any, OperationVariables>;
  refetch: Function;
}
