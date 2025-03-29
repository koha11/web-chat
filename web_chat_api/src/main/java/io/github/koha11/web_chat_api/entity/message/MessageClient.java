package io.github.koha11.web_chat_api.entity.message;

import io.github.koha11.web_chat_api.entity.user.UserClient;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.bson.types.ObjectId;

@Data
@AllArgsConstructor
public class MessageClient{
    private ObjectId id;

    private final UserClient user;

    private String msgBody;

    private boolean status;

    public MessageClient(Message msg, UserClient userClient) {
        id = msg.getId();
        user = userClient;
        msgBody = msg.getMsgBody();
        status = msg.isStatus();
    }
}
