import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { ILoginRequest } from "../../interfaces/auth/loginRequest.interface";

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<ILoginRequest>();

  const handleLogin = async (data: ILoginRequest) => {
    try {
      navigate("/m");

      // const response: AuthResponse = await postData("/auth/login", formData);
      // console.log(response);
      // if (response.status == 0) {
      // }

      // if (response.status == 1) {
      //   console.log("login successfully");
      //   Cookies.set("accessToken", response.accessToken, {
      //     expires: response.expiresIn / 24,
      //   });
      //   navigate("/m");
      // }
    } catch (error) {
      console.error(error);
    }
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
    </section>
  );
};

export default Login;
