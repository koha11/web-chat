package io.github.koha11.web_chat_api.service;

import io.github.koha11.web_chat_api.entity.chat.Chat;
import io.github.koha11.web_chat_api.entity.chat.ChatListItem;
import io.github.koha11.web_chat_api.entity.message.Message;
import io.github.koha11.web_chat_api.entity.message.MessageClient;
import io.github.koha11.web_chat_api.entity.user.User;
import io.github.koha11.web_chat_api.entity.user.UserClient;
import io.github.koha11.web_chat_api.repository.ChatRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.rmi.NoSuchObjectException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserService userService;

    private final String notFoundMsg = "Can not find Chat with this id";

    // GET
    public List<ChatListItem> getChatList() {

        ObjectId userId = UserService.getCurrentUserId();

        var chats = chatRepository.findAllChatByUser(userId);

        return chats.map(chatList -> chatList.stream().map(chat -> {
            List<UserClient> userClient = chat.getUsers().stream().map(
                    UserClient::new
            ).toList();

            return new ChatListItem(chat, userClient);

        }).toList()).orElseGet(ArrayList::new);
    }

    public List<MessageClient> getMessages(ObjectId chatId){
        if(isCurrUserChat(chatId))
            throw new ResourceAccessException("You can not access this chat");

        return chatRepository.findById(chatId).map(chat -> {
            List<Message> msgList = chat.getMessages();

            return msgList.stream().map(msg ->
                    new MessageClient(
                            msg,
                            new UserClient(msg.getUser())
                    )
            ).toList();

        }).orElseGet(ArrayList::new);
    }

    public ChatListItem getChatDetails(ObjectId chatId)  {
        if(isCurrUserChat(chatId))
            throw new ResourceAccessException("You can not access this chat");

        return chatRepository.findById(chatId).map(chat -> new ChatListItem(
                        chat,
                        chat.getUsers().stream().map(UserClient::new).toList()
                ))
                .orElseThrow(() ->
                        new ResourceNotFoundException(notFoundMsg));

    }

    // POST

    public void addChat(List<ObjectId> contactIds) {

        ObjectId userId = UserService.getCurrentUserId();

        User currUser = userService.getUserById(userId);

        List<User> users = new ArrayList<>();
        users.add(currUser);

        contactIds.forEach(contactId -> {
            User contact = userService.getUserById(contactId);
            users.add(contact);
        });

        var newChat = new Chat(users);

        chatRepository.save(newChat);
    }

    // PUT

    public void toggleHideChat(ObjectId chatId) {
        if(isCurrUserChat(chatId))
            throw new ResourceAccessException("You can not access this chat");

        chatRepository.findById(chatId).ifPresent(chat -> {
            chat.setHidden(!chat.isHidden());
            chatRepository.save(chat);
        });

    }

    public void changeNickname(ObjectId chatId, ObjectId contactId, String nickname) {
        if(isCurrUserChat(chatId))
            throw new ResourceAccessException("You can not access this chat");

        chatRepository.findById(chatId).ifPresent(chat -> {
            chat.getNicknames()
                    .replace(
                            contactId.toHexString()
                            ,nickname
                    );

            chatRepository.save(chat);
            }
        );
    }

    public void addUserToChat(ObjectId chatId, List<ObjectId> contactIds) {
        if(isCurrUserChat(chatId))
            throw new ResourceAccessException("You can not access this chat");

        chatRepository.findById(chatId).ifPresent(chat -> {
                    contactIds.forEach(contactId -> {
                        var user = userService.getUserById(contactId);
                        chat.getUsers().add(user);
                        chat.getNicknames().put(contactId.toHexString(),user.getFullName());
                    });

                    chatRepository.save(chat);
                }
        );
    }

    public boolean isCurrUserChat(ObjectId chatId) {
        ObjectId userId = UserService.getCurrentUserId();
        User user = userService.getUserById(userId);

        return chatRepository.findById(chatId).map(chat -> chat.getUsers().contains(user)).orElseThrow(() -> new ResourceNotFoundException(notFoundMsg));
    }
}
