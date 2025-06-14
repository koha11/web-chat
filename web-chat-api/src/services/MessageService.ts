import { Server, Socket } from "socket.io";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";

class MessageService {
  listenChangeMessage(socket: Socket, io: Server) {}

  listenSendMessage(socket: Socket, io: Server) {
    const user = socket.data.user as ITokenPayload;
    socket.on("send-message", (msg) => {
      console.log(user.username + " have sent " + msg);
      io.emit("receive-message", msg);
    });
  }
}

const messageService = new MessageService();

export default messageService;
