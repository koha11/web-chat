package io.github.koha11.web_chat_api.entity.message;

import io.github.koha11.web_chat_api.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;

@Document(collection = "messages")
@Data
public class Message {
    @Id
    private ObjectId id;

    @DocumentReference
    private final User user;

    private String msgBody;

    private boolean status;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Message(ObjectId id, User user, String msgBody) {
        this.id = id;
        this.user = user;
        this.msgBody = msgBody;
        this.status = false;
    }


    public Message(User user, String msgBody, boolean status) {
        this.user = user;
        this.msgBody = msgBody;
        this.status = status;
    }
}
