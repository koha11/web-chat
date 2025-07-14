import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { ILoginRequest } from "../../interfaces/auth/loginRequest.interface";
import { useLogin } from "../../hooks/auth.hook";
import { Button } from "@/components/ui/button";
import { IS_DEV_ENV, SERVER_HOST, SERVER_PORT } from "@/apollo";

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<ILoginRequest>();

  const [login] = useLogin();

  const handleLogin = (data: ILoginRequest) => {
    login({
      variables: {
        ...data,
      },
      onCompleted({ login: response }) {
        if (response.isValid && response.data != undefined) {
          Cookies.set("accessToken", response.data.accessToken);
          Cookies.set("userId", response.data.userId);
          navigate("/m");
        }
      },
    });
  };

  return (
    <section className="flex justify-center items-center flex-col h-[100vh]">
      <image href="/favicon.ico"></image>
      <h2 className="py-4 text-3xl font-mono font-bold">WEB CHAT</h2>
      <form
        className="flex flex-col w-[40%] items-center mt-12"
        onSubmit={handleSubmit(handleLogin)}
      >
        <input
          {...register("username")}
          placeholder="Username"
          className="py-2 px-3 border rounded border-gray-400 w-full"
        ></input>
        <input
          {...register("password")}
          placeholder="Password"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <button
          type="submit"
          className="bg-blue-700 text-white p-2 cursor-pointer w-[20%] hover:opacity-70 rounded-4xl mt-6"
        >
          Continue
        </button>
        <div className="mt-6">
          <input id="rbmBtn" type="checkbox" name="rmbBtn"></input>
          <label htmlFor="rbmBtn" className="ml-2">
            Keep Logining
          </label>
        </div>
      </form>
      <hr className="w-[40%] h-[1px] text-gray-300 mt-4"></hr>
      <div className="mt-4 flex items-center justify-evenly w-[50%]">
        <Link to="/register" className="cursor-pointer hover:opacity-70">
          Register
        </Link>
        <Link to="" className="cursor-pointer hover:opacity-70">
          Forgot Password
        </Link>
      </div>
      <hr className="w-[40%] h-[1px] text-gray-300 mt-4"></hr>
      <div className="mt-4 flex items-center justify-evenly w-[50%]">
        <Button
          className="cursor-pointer hover:opacity-70 w-12 h-12 bg-contain bg-no-repeat bg-center rounded-full"
          style={{ backgroundImage: `url(/assets/images/google-logo.png)` }}
          variant={"outline"}
          onClick={() => {
            const URL = IS_DEV_ENV
              ? `http://${SERVER_HOST}:${SERVER_PORT}/auth/google`
              : `https://${SERVER_HOST}/auth/google`;

            window.open(URL, "_blank");
          }}
        ></Button>
      </div>
    </section>
  );
};

export default Login;
