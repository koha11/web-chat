package io.github.koha11.web_chat_api.controller;

import io.github.koha11.web_chat_api.entity.user.USER_RELA;
import io.github.koha11.web_chat_api.entity.user.User;
import io.github.koha11.web_chat_api.entity.user.UserClient;
import io.github.koha11.web_chat_api.entity.user.UserContact;
import io.github.koha11.web_chat_api.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    private UserService userService;

    //Use to get editable user info except password
    @GetMapping(path = "/get-info")
    UserClient getInfo() {
        return userService.getInfo();
    }

    //Use to get contact/favorite/block/request-queue/all-sent-requests list
    @GetMapping(path = "/get-contact-list")
    Map<String, UserContact> getContactList(@RequestParam USER_RELA relation) {
        return userService.getContactList(relation);
    }

    @PutMapping(path = "change-info")
    void changeInfo(@RequestParam(required = false) String fullName, @RequestParam(required = false) String avatar, @RequestParam(required = false) String email) {
        userService.changeInfo(fullName, avatar, email);
    }

    //Use to send/deny connect request, block/unblock contact, mark favorite contact
    @PutMapping(path = "/change-relationship")
    void changeRelationship(@RequestParam ObjectId contactId, @RequestParam USER_RELA relation) {
        userService.changeUserRelationship(contactId, relation);
    }


}
