import { Server, Socket } from "socket.io";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";
import Message, { IMessage } from "../models/Message.model";

class MessageService {
  listenChangeMessage(socket: Socket, io: Server) {}

  listenSendMessage(socket: Socket, io: Server) {
    const user = socket.data.user as ITokenPayload;
    socket.on("send-message", (msg: IMessage) => {
      console.log(user.username + " have sent " + msg.msgBody);

      Message.create(msg).then((msg) => {
        io.emit("receive-message", msg);
      });
    });
  }
}

const messageService = new MessageService();

export default messageService;
