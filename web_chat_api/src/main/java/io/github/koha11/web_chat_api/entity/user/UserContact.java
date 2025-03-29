package io.github.koha11.web_chat_api.entity.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserContact {
    private UserClient contact;
    private USER_RELA relationship;
    private Instant RequestDate;
}
