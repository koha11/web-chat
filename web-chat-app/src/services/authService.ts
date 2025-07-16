import { gql } from "@apollo/client";

export const GET_ACCOUNT = gql`
  query GetAccount($userId: ID!) {
    account(userId: $userId) {
      username
      email
      isConfirmedEmail
    }
  }
`;

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
    $email: String
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

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($email: String!) {
    verifyEmail(email: $email)
  }
`;

export const CHANGE_EMAIL = gql`
  mutation ChangeEmail($email: String!) {
    changeEmail(email: $email)
  }
`;
