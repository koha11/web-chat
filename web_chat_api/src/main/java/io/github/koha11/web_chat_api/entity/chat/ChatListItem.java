package io.github.koha11.web_chat_api.entity.chat;

import io.github.koha11.web_chat_api.entity.user.UserClient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.bson.types.ObjectId;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class ChatListItem {
    private ObjectId id;
    private String chatName;
    private List<UserClient> users;
    private Map<String, String> nicknames;
    private String lastMsg;
    private Instant lastMsgTimespan;
    private ObjectId lastSenderId;

    public ChatListItem(Chat chat, List<UserClient> userClient) {
        var _msg = chat.getMessages();

        id = chat.getId();
        users = userClient;
        chatName = chat.getChatName();
        nicknames = chat.getNicknames();

        if(_msg.isEmpty())
        {
            lastMsg = "";
            lastMsgTimespan = null;
            lastSenderId = null;
        }
        else
        {
            var _lastMsg = _msg.get(_msg.size() - 1);
            lastMsg = _lastMsg.getMsgBody();
            lastMsgTimespan = _lastMsg.getCreatedAt();
            lastSenderId = _lastMsg.getId();
        }
    }
}
