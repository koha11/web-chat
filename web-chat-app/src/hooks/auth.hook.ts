import { useMutation, useQuery } from "@apollo/client";
import {
  CHANGE_EMAIL,
  GET_ACCOUNT,
  LOGIN,
  REGISTER,
  VERIFY_EMAIL,
} from "../services/authService";
import IAccount from "@/interfaces/account.interface";
import IMyQueryResult from "@/interfaces/myQueryResult.interface";

export const useGetAccount = ({
  userId,
}: {
  userId: string;
}): IMyQueryResult<IAccount> => {
  const myQuery = useQuery(GET_ACCOUNT, {
    variables: { userId },
    skip: !userId,
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.account,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useLogin = () => {
  return useMutation(LOGIN);
};

export const useRegister = () => {
  return useMutation(REGISTER);
};

export const useVerifyEmail = () => {
  return useMutation(VERIFY_EMAIL);
};

export const useChangeEmail = (userId: string) => {
  return useMutation(CHANGE_EMAIL, {
    update: (cache, { data }) => {
      const email = data.changeEmail;

      const account = cache.readQuery({
        query: GET_ACCOUNT,
        variables: { userId },
      });

      if (account)
        cache.writeQuery({
          query: GET_ACCOUNT,
          variables: { userId },
          data: {
            account: {
              ...account,
              email,
            },
          },
        });
    },
  });
};
