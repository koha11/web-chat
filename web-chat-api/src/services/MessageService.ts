import { Server, Socket } from "socket.io";
import { ITokenPayload } from "../interfaces/auth/tokenPayload.interface";
import Message, { IMessage } from "../models/Message.model";
import Chat from "../models/Chat.model";

class MessageService {
  listenSendMessage(socket: Socket, io: Server) {
    const user = socket.data.user as ITokenPayload;
    socket.on("send-message", async (msg: IMessage, chatId: string) => {
      console.log(user.username + " have sent " + msg.msgBody);

      const myMsg = await Message.create(msg);

      await Chat.findByIdAndUpdate(chatId, { $push: { messages: myMsg } });

      io.emit("receive-message", myMsg);
    });
  }
}

const messageService = new MessageService();

export default messageService;
