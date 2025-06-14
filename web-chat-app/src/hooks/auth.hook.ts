import { useMutation } from "@tanstack/react-query";
import { ILoginRequest } from "../interfaces/auth/loginRequest.interface";
import { login, register } from "../services/authService";
import { IRegisterRequest } from "../interfaces/auth/registerRequest.interface";

export const useLogin = () => {
  return useMutation({
    mutationFn: (request: ILoginRequest) => login(request),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (request: IRegisterRequest) => register(request),
  });
};
