package io.github.koha11.web_chat_api.service;

import io.github.koha11.web_chat_api.entity.user.*;
import io.github.koha11.web_chat_api.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.*;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userDetail = userRepository.findByUsername(username);

        // Converting UserInfo to UserDetails
        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public User getUserById(ObjectId id) {
        Optional<User> user = userRepository.findById(id);

        if(user.isPresent())
            return user.get();

        throw new IllegalStateException("Ko tim thay user voi id " + id);
    }

    // Pthuc lay ra id cua user hien tai
    static public ObjectId getCurrentUserId() {
        UserInfoDetails currentUser = (UserInfoDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(currentUser == null)
            throw new IllegalStateException("You can not access to this method");

        return currentUser.getId();
    }

    public UserClient getInfo() {
        ObjectId userId = UserService.getCurrentUserId();

        User currUser = getUserById(userId);

        return new UserClient(currUser);
    }

    public Map<String,UserContact> getContactList(USER_RELA relation) {
        ObjectId userId = UserService.getCurrentUserId();

        User currUser = getUserById(userId);
        Map<String,UserContact> allContactList = currUser.getContactList();

        Map<String, UserContact> contactList = new HashMap<>();

        allContactList.forEach((contactId, userContact) -> {
            var userRelationship = userContact.getRelationship();
            if(userRelationship == relation ||
                    (userRelationship == USER_RELA.IS_FAVORITE
                            && relation == USER_RELA.IS_CONNECTED))
                contactList.put(contactId, userContact);
        });

        return contactList;
    }

    public void addUser(User userInfo) {
        // Encode password before saving the user
        userInfo.setPassword(encoder.encode(userInfo.getPassword()));

        userInfo.setAvatar("");
        userInfo.setContactList(new HashMap<>());
        userInfo.setRoles("ROLE_USER");
        userInfo.setAvatar("test.jpg");

        userRepository.save(userInfo);
    }

    public void changeInfo(String fullName, String avatar, String email) {
        ObjectId userId = UserService.getCurrentUserId();

        User currUser = getUserById(userId);

        if(fullName != null)
            currUser.setFullName(fullName);

        if(avatar != null)
            currUser.setAvatar(avatar);

        if(email != null) {
            currUser.setEmail(email);
            currUser.setConfirmedEmail(false);
        }
    }

    @Transactional
    public void changeUserRelationship(ObjectId contactId, USER_RELA relation) {
        if(relation == USER_RELA.IS_REQUESTED || relation == USER_RELA.IS_BLOCKED)
            throw new IllegalStateException("this USER_RELA variable is not available!");

        ObjectId userId = UserService.getCurrentUserId();

        User currUser = getUserById(userId);
        User contactUser = getUserById(contactId);

        if(relation == USER_RELA.REQUEST)
            initAndChangeUserRelationship(contactUser, currUser, USER_RELA.IS_REQUESTED);

        if(relation == USER_RELA.BLOCK)
            initAndChangeUserRelationship(contactUser, currUser, USER_RELA.IS_BLOCKED);

        if(relation == USER_RELA.REMOVE_ALL)
        {
            currUser.getContactList().remove(contactId.toHexString());
            contactUser.getContactList().remove(userId.toHexString());
        }
        else
            initAndChangeUserRelationship(currUser, contactUser, relation);
    }

    public boolean changePassword(String oldPwd, String newPwd) {
        ObjectId userId = UserService.getCurrentUserId();

        User currUser = getUserById(userId);

        if(encoder.matches(oldPwd, currUser.getPassword()))
        {
            currUser.setPassword(encoder.encode(newPwd));
            return true;
        }

        return false;
    }

    private static void initAndChangeUserRelationship(User currUser, User contactUser, USER_RELA relation) {
        UserContact userContact = currUser.getContactList().get(contactUser.getId().toHexString());

        // Neu khong co contactUser voi key la contactId
        if(userContact == null)
        {
            userContact = new UserContact(
                    new UserClient(contactUser),
                    relation,
                    Instant.now());

            // Neu user hien tai khong co contactList
            if(currUser.getContactList() == null)
                currUser.setContactList(new HashMap<>(Map.of(
                        userContact.getContact().getId().toHexString(),
                        userContact))
                );
            else
                currUser.getContactList().put(
                        userContact.getContact().getId().toHexString(),
                        userContact
                );
        }
        else
            userContact.setRelationship(relation);
    }
}
