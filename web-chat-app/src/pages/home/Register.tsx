import { Link, redirect } from 'react-router-dom';
import { postData } from '../../services/api';

const Register = () => {
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Ngăn chặn reload trang

    try {
      const data = new FormData(event.currentTarget); // Tạo FormData từ form
      const formObject = Object.fromEntries(data.entries()); // Chuyển thành object

      const response = await postData('/signup', formObject);

      window.location.href = 'http://' + window.location.host + '/login';
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
        onSubmit={handleRegister}
      >
        <input
          name="fullname"
          placeholder="Họ và tên"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <input
          name="email"
          placeholder="Email"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <input
          name="username"
          placeholder="Email hoặc số điện thoại"
          className="py-2 px-3 border rounded border-gray-400 w-full"
        ></input>
        <input
          name="password"
          placeholder="Mật khẩu"
          className="py-2 px-3 mt-6 border rounded border-gray-400 w-full"
        ></input>
        <button
          type="submit"
          className="bg-blue-700 text-white p-2 cursor-pointer w-[20%] hover:opacity-70 rounded-4xl mt-6"
        >
          Tiếp tục
        </button>
        <div className="mt-6">
          <input id="rbmBtn" type="checkbox" name="rmbBtn"></input>
          <label htmlFor="rbmBtn" className="ml-2">
            Duy trì đăng nhập
          </label>
        </div>
      </form>
      <hr className="w-[40%] h-[1px] text-gray-300 mt-4"></hr>
      <div className="mt-4 flex items-center justify-evenly w-[50%]">
        <Link to="/register" className="cursor-pointer hover:opacity-70">
          Đăng ký
        </Link>
        <Link to="/register" className="cursor-pointer hover:opacity-70">
          Quên mật khẩu
        </Link>
      </div>
    </section>
  );
};

export default Register;
