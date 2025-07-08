import { gql } from "@apollo/client";

export const GET_CONNECTABLE_USERS = gql`
  query GetConnectableUsers($userId: ID!) {
    connectableUsers(userId: $userId) {
      id
      avatar
      fullname
    }
  }
`;
