import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      userId
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $username: String!
    $password: String!
    $fullname: String!
    $email: String!
  ) {
    register(
      username: $username
      password: $password
      fullname: $fullname
      email: $email
    ) {
      accessToken
      userId
    }
  }
`;
