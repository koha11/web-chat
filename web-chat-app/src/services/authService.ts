import { gql } from "@apollo/client";
import httpRequest from "../config/axios/axios.config";
import { ILoginRequest } from "../interfaces/auth/loginRequest.interface";
import { IRegisterRequest } from "../interfaces/auth/registerRequest.interface";
import { IMyResponse } from "../interfaces/myResponse.interface";

export const login = async (
  requestData: ILoginRequest
): Promise<IMyResponse> => {
  const { data } = await httpRequest.post("/auth/login", requestData);

  return data;
};

export const register = async (
  requestData: IRegisterRequest
): Promise<IMyResponse> => {
  const { data } = await httpRequest.post("/auth/register", requestData);

  return data;
};

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      isValid
      data
      message
    }
  }
`;
