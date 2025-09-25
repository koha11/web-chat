import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { ILoginRequest } from "../../interfaces/auth/loginRequest.interface";
import { useLogin } from "../../hooks/auth.hook";
import { Button } from "@/components/ui/button";
import { IS_DEV_ENV, SERVER_HOST, SERVER_PORT } from "@/apollo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSchemaType, loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/ui/loading";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const [login] = useLogin();

  const handleLogin = (data: ILoginRequest) => {
    setIsLoading(true);
    login({
      variables: {
        ...data,
      },
      onCompleted({ login: response }) {
        setIsLoading(false);

        if (response) {
          Cookies.set("accessToken", response.accessToken);
          Cookies.set("userId", response.userId);
          navigate("/m");
        }
      },
      onError: ({ message }) => {
        setIsLoading(false);
        if (message.startsWith("Username")) setError("username", { message });

        if (message.startsWith("Password")) setError("password", { message });
      },
    });
  };

  return (
    <section className="flex justify-center items-center flex-col h-[100vh]">
      {isLoading && (
        <div className="bg-[rgba(0,0,0,0.2)] w-full h-full absolute top-0 left-0 z-0">
          <Loading></Loading>
        </div>
      )}

      <h2 className="py-4 text-3xl font-mono font-bold">WEB CHAT</h2>
      <form
        className="flex flex-col w-[40%] items-center mt-12"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Input
          {...register("username")}
          placeholder="Username"
          className={`py-2 px-3 border rounded border-gray-400 w-full ${
            errors.username && "border-red-700"
          }`}
        ></Input>
        <div className="py-4 relative w-full">
          <div className="text-sm absolute text-nowrap left-2 top-1 text-red-600">
            {errors.username && errors.username.message}
          </div>
        </div>
        <Input
          {...register("password")}
          placeholder="Password"
          type="password"
          className={`py-2 px-3 border rounded border-gray-400 w-full ${
            errors.password && "border-red-700"
          }`}
        ></Input>
        <div className="py-4 relative w-full">
          <div className="text-sm absolute text-nowrap left-2 top-1 text-red-600">
            {errors.password && errors.password.message}
          </div>
        </div>
        <Button
          type="submit"
          className="bg-blue-700 text-white p-2 cursor-pointer w-[20%] hover:opacity-70 rounded-md mt-6"
        >
          Login
        </Button>
        {/* <div className="mt-6 flex justify-center items-center gap-4">
          <Input
            id="rbmBtn"
            type="checkbox"
            name="rmbBtn"
            className="h-4 w-4"
          ></Input>
          <Label htmlFor="rbmBtn" className="">
            Keep Logining
          </Label>
        </div> */}
      </form>
      <hr className="w-[40%] h-[1px] text-gray-300 mt-4"></hr>
      <div className="mt-4 flex items-center justify-center w-[50%] gap-4">
        <Link
          to="/register"
          className="cursor-pointer hover:opacity-70 underline text-blue-600"
        >
          Register
        </Link>
        or login with
        <Button
          className="cursor-pointer hover:opacity-70 w-8 h-8 bg-contain bg-no-repeat bg-center rounded-full"
          style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
          variant={"outline"}
          onClick={() => {
            const URL = IS_DEV_ENV
              ? `http://${SERVER_HOST}:${SERVER_PORT}/auth/google`
              : `https://${SERVER_HOST}/auth/google`;

            window.open(URL, "_blank");
          }}
        ></Button>
        {/* <Link to="" className="cursor-pointer hover:opacity-70">
          Forgot Password
        </Link> */}
      </div>
      <hr className="w-[40%] h-[1px] text-gray-300 mt-4"></hr>
      <div className="mt-4 flex items-center justify-evenly w-[50%]"></div>
    </section>
  );
};

export default Login;
