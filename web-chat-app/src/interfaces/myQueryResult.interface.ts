import { OperationVariables, SubscribeToMoreFunction } from "@apollo/client";

export default interface IMyQueryResult<T> {
  data: T;
  loading: boolean;
  subscribeToMore: SubscribeToMoreFunction<any, OperationVariables>;
  refetch: Function;
}
