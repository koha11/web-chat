import { useEffect, useState } from "react";
import { getData } from "../services/api";
import ChatRow from "../components/ChatRow";
import { Link, Outlet } from "react-router-dom";
import WebSocketConnection from "../services/WebSocketConnection";
import { Modal, Ripple, initTWE } from "tw-elements";
import { fetchChatListEvent } from "../services/chatService";
import Cookies from "js-cookie";
import { Socket } from "socket.io-client";
import { listenReceiveMessage } from "../services/messageService";
import { Contact, LogOut, User } from "lucide-react";
import { IChat } from "../interfaces/chat.interface";

const Mainlayout = () => {
  return <Outlet></Outlet>;
};

export default Mainlayout;
