package io.github.koha11.web_chat_api.entity.chat;

import com.mongodb.lang.Nullable;
import io.github.koha11.web_chat_api.entity.message.Message;
import io.github.koha11.web_chat_api.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "chats")
public class Chat {
    @Id
    private ObjectId id;
    private String chatName;
    private boolean isHidden;

    @DocumentReference
    private List<User> users;

    private Map<String,String> nicknames;

    @DocumentReference
    private List<Message> messages;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Chat(List<User> users) {
        this.users = users;
        chatName = null;
        messages = new ArrayList<>();
        nicknames = new HashMap<>();

        users.forEach(user -> nicknames.put(
                user.getId().toHexString(),
                user.getFullName())
        );
    }
}
