package io.github.koha11.web_chat_api.entity.user;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import java.time.Instant;
import java.util.Map;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserClient {
    ObjectId id;
    String fullName;
    String username;
    String avatar;
    private String email;
    private boolean isOnline;
    @Nullable
    private Instant lastOnlineTime;

    public UserClient(User user) {
        id = user.getId();
        fullName = user.getFullName();
        username = user.getUsername();
        avatar = user.getAvatar();
        isOnline = user.isOnline();
        email = user.getEmail();
        lastOnlineTime = user.getLastOnlineTime();
    }

    public UserClient(Map<String, User> stringUserMap) {
    }
}
