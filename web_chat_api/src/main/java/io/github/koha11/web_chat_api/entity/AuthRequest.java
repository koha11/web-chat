package io.github.koha11.web_chat_api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Data
public class AuthRequest {
    private String username;
    private String password;
}
