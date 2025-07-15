import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/auth.hook";
import { IRegisterRequest } from "../../interfaces/auth/registerRequest.interface";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, RegisterSchemaType } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

const Register = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<RegisterSchemaType>({ resolver: zodResolver(registerSchema) });

  const [registerAccount] = useRegister();

  const handleRegister = (data: IRegisterRequest) => {
    registerAccount({
      variables: {
        ...data,
      },
      onCompleted({ register: response }) {
        if (response) {
          Cookies.set("accessToken", response.accessToken);
          Cookies.set("userId", response.userId);
          navigate("/m");
        }
      },
      onError: ({ message }) => {
        if (message.startsWith("Username")) setError("username", { message });

        if (message.startsWith("Email")) setError("email", { message });
      },
    });
  };

  return (
    <section className="flex justify-center items-center flex-col h-[100vh]">
      <image href="/favicon.ico"></image>
      <h2 className="py-4 text-3xl font-mono font-bold">WEB CHAT</h2>
      <form
        className="flex flex-col w-[40%] items-center mt-4"
        onSubmit={handleSubmit(handleRegister)}
      >
        <Input
          {...register("fullname")}
          placeholder="Fullname"
          className={`py-2 px-3 mt-6 border rounded border-gray-400 w-full ${
            errors.fullname && "border-red-700"
          }`}
        ></Input>
        <div className="py-2 relative w-full">
          <div className="text-sm absolute text-nowrap left-2 top-1 text-red-600">
            {errors.fullname && errors.fullname.message}
          </div>
        </div>
        <Input
          {...register("email")}
          placeholder="Email"
          className={`py-2 px-3 mt-6 border rounded border-gray-400 w-full ${
            errors.email && "border-red-700"
          }`}
        ></Input>
        <div className="py-2 relative w-full">
          <div className="text-sm absolute text-nowrap left-2 top-1 text-red-600">
            {errors.email && errors.email.message}
          </div>
        </div>
        <Input
          {...register("username")}
          placeholder="Username"
          className={`py-2 px-3 mt-6 border rounded border-gray-400 w-full ${
            errors.username && "border-red-700"
          }`}
        ></Input>
        <div className="py-2 relative w-full">
          <div className="text-sm absolute text-nowrap left-2 top-1 text-red-600">
            {errors.username && errors.username.message}
          </div>
        </div>
        <Input
          {...register("password")}
          placeholder="Password"
          className={`py-2 px-3 mt-6 border rounded border-gray-400 w-full ${
            errors.password && "border-red-700"
          }`}
          type="password"
        ></Input>
        <div className="py-2 relative w-full">
          <div className="text-sm absolute text-nowrap left-2 top-1 text-red-600">
            {errors.password && errors.password.message}
          </div>
        </div>
        <Input
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          className={`py-2 px-3 mt-6 border rounded border-gray-400 w-full ${
            errors.confirmPassword && "border-red-700"
          }`}
          type="password"
        ></Input>
        <div className="py-2 relative w-full">
          <div className="text-sm absolute text-nowrap left-2 top-1 text-red-600">
            {errors.confirmPassword && errors.confirmPassword.message}
          </div>
        </div>
        <Button
          type="submit"
          className="bg-blue-700 text-white p-2 cursor-pointer w-[20%] hover:opacity-70 rounded-4xl mt-6"
        >
          Register
        </Button>
      </form>
      <hr className="w-[40%] h-[1px] text-gray-300 mt-4"></hr>
      <div className="mt-4 flex items-center justify-evenly w-[50%]">
        <Link to="/login" className="cursor-pointer hover:opacity-70">
          Login
        </Link>
        <Link to="" className="cursor-pointer hover:opacity-70">
          Forgot password
        </Link>
      </div>
    </section>
  );
};

export default Register;
