import { Server, Socket } from "socket.io";

class MessageService {
  listenChangeMessage(socket: Socket, io: Server) {}
}

const messageService = new MessageService();

export default messageService;
