import { Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home.tsx';
import Login from './pages/home/Login.tsx';
import Register from './pages/home/Register.tsx';

import ChatIndex from './pages/chat/ChatIndex.tsx';
import ChatDetails from './pages/chat/ChatDetails.tsx';

import ChatLayout from './layouts/ChatLayout.tsx';

import './App.css';
import Contact from './pages/contact/Contact.tsx';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/m" element={<ChatLayout />}>
        <Route index element={<ChatIndex />}></Route>
        <Route path=":id" element={<ChatDetails />}></Route>
      </Route>

      <Route path="/me">
        <Route index element={<ChatIndex />}></Route>
      </Route>

      <Route path="/contact">
        <Route index element={<Contact />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
