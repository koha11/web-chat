import { gql } from "@apollo/client";

export const GET_CONNECTABLE_USERS = gql`
  query GetConnectableUsers($userId: ID!, $first: Int, $after: ID) {
    connectableUsers(userId: $userId, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          avatar
          fullname
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;
