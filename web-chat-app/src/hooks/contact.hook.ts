import { useQuery } from "@apollo/client";
import { GET_CONTACTS } from "../services/contactService";
import IContact from "../interfaces/contact.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";

export const useGetContacts = ({
  userId,
  after,
  first,
}: {
  userId: string;
  first?: number;
  after?: string;
}): IMyQueryResult<IModelConnection<IContact>> => {
  const myQuery = useQuery(GET_CONTACTS, {
    variables: { userId, first, after },
    skip: !userId,
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.contacts,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};
