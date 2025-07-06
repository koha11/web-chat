import { useMutation } from "@apollo/client";
import { LOGIN } from "../services/authService";

export const useLogin = () => {
  return useMutation(LOGIN);
};

// export const useRegister = () => {
//   return useMutation({
//     mutationFn: (request: IRegisterRequest) => register(request),
//   });
// };
