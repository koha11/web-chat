import { useEffect, useState } from 'react';
import { getData } from '../services/api';
import { ChatRowProps, ChatRow } from '../components/ChatRow';
import { Outlet } from 'react-router-dom';
import WebSocketConnection from './../services/WebSocketConnection';

export default function ChatLayout() {
  const [chatList, setChatList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const socket = WebSocketConnection.getConnection();
  useEffect(() => {
    getData('/m/get-chatlist').then((data) => setChatList(data));
    // const socket = WebSocketConnection.getConnection();

    // socket.on('connect', () => {
    //   console.log(socket.id + ' is on connect ...');
    //   // socket.on('message', (message) => {
    //   //   console.log(`Receiving message "${message}" ...`);
    //   // });
    // });
  }, []);

  return (
    <div className="flex justify-center text-black h-[100vh]">
      <div className="container flex bg-white gap-4 py-4">
        <section
          className="w-[25%] h-full p-2 bg-white rounded-2xl"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0 0 5px 2px' }}
        >
          <div className="flex justify-between items-center h-[10%] px-2">
            <h1 className="text-2xl font-bold">Đoạn chat</h1>
            <div className="text-xl">
              <a href="/me" className="mr-2">
                <i className="bx bx-cog p-2 rounded-full bg-gray-200 hover:opacity-50"></i>
              </a>
              <a href="">
                <i className="bx bxs-edit p-2 rounded-full bg-gray-200 hover:opacity-50"></i>
              </a>
            </div>
          </div>
          <div className="h-[10%] flex items-center py-4 px-2">
            <form action="" className="relative w-full">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="rounded-3xl bg-gray-200 px-8 py-2 w-full text-gray-500"
                placeholder="Tìm kiếm đoạn chat"
              ></input>
              <i className="bx bx-search absolute left-3 top-[50%] translate-y-[-50%] text-gray-500"></i>
            </form>
          </div>
          <nav id="chat-box-list" className="h-[80%] overflow-y-scroll">
            {chatList.map((chat: ChatRowProps) => (
              <ChatRow
                key={chat.id}
                id={chat.id}
                user={chat.user}
                lastMessage={chat.lastMessage}
              ></ChatRow>
            ))}
          </nav>
        </section>
        <Outlet />
      </div>
    </div>
  );
}
