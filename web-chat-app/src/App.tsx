import { Routes, Route, RouterProvider } from "react-router-dom";

import Home from "./pages/home/Home.tsx";
import Login from "./pages/home/Login.tsx";
import Register from "./pages/home/Register.tsx";

import ChatIndex from "./pages/chat/ChatIndex.tsx";
import ChatDetails from "./pages/chat/ChatDetails.tsx";

import ChatLayout from "./layouts/MainLayout.tsx";

import "./App.css";
import Contact from "./pages/contact/Contact.tsx";
import router from "./routes";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
