import { Request, Response } from "express";
import chatService from "../services/ChatService";

class ChatController {
  getRecentChat(req: Request, res: Response) {
    const user = req.user;

    if (user) {
      chatService.getChatList(user.id.toString()).then((chatList) => {
        res.json(chatList);
      });
    }
  }
}

const chatController = new ChatController();

export default chatController;
