package io.github.koha11.web_chat_api.entity.user;

import com.mongodb.lang.Nullable;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private ObjectId id;

    private final String username;
    private String password;
    private String fullName;

    private String email;
    private boolean isConfirmedEmail;

    private String roles;
    private String avatar;

    private Map<String,UserContact> contactList;

    private boolean isOnline;
    private Instant lastOnlineTime;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

}
