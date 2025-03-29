package io.github.koha11.web_chat_api.controller;

import io.github.koha11.web_chat_api.entity.chat.ChatListItem;
import io.github.koha11.web_chat_api.entity.message.MessageClient;
import io.github.koha11.web_chat_api.service.ChatService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/get-chat-list")
    List<ChatListItem> getChatList() {
        return chatService.getChatList();
    }

    @GetMapping("/get-chat-details/{chatId}")
    ChatListItem getChatDetails(@PathVariable ObjectId chatId)
    {
        return chatService.getChatDetails(chatId);
    }

    @GetMapping("/get-messages/{chatId}")
    List<MessageClient> getMessages(@PathVariable ObjectId chatId) {
        return chatService.getMessages(chatId);
    }

    @PostMapping("/add-chat")
    void addChat(@RequestParam List<ObjectId> contactIds) {
        chatService.addChat(contactIds);
    }

    @PutMapping("/change-nickname/{chatId}")
    void changeNickname(@PathVariable ObjectId chatId, @RequestParam ObjectId contactId, @RequestParam String nickname) {
        chatService.changeNickname(chatId,contactId,nickname);
    }




}
