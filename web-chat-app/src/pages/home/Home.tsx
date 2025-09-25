import { Link } from "react-router-dom";

const Home = () => {

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 text-center bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome to Web Chat App!
      </h1>
      <p className="text-gray-600 mb-8">
        Connect and chat instantly with friends and colleagues. Our web chat app
        offers real-time messaging, group chats, and a secure environment for
        your conversations.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/login"
          className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-5 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Register
        </Link>
        <Link
          to="/m"
          className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
        >
          Go to Chat
        </Link>
      </div>
    </div>
  );
};

export default Home;
