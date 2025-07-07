import { useMutation } from "@apollo/client";
import { LOGIN, REGISTER } from "../services/authService";

export const useLogin = () => {
  return useMutation(LOGIN);
};

export const useRegister = () => {
  return useMutation(REGISTER);
};
