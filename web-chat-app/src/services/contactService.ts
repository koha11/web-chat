import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query GetContacts($userId: ID, $after: ID, $first: Int) {
    contacts(userId: $userId, after: $after, first: $first) {
      edges {
        cursor
        node {
          id
          users {
            id
            avatar
            fullname
          }
          chatId
          relationship
        }
      }
    }
  }
`;
