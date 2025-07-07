import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      isValid
      data
      message
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $username: String!
    $password: String!
    $rePassword: String!
    $fullname: String!
    $email: String!
  ) {
    register(
      username: $username
      password: $password
      rePassword: $rePassword
      fullname: $fullname
      email: $email
    ) {
      isValid
      data
      message
    }
  }
`;
