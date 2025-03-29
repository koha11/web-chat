package io.github.koha11.web_chat_api.repository;

import io.github.koha11.web_chat_api.entity.chat.Chat;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends MongoRepository<Chat, ObjectId> {
    @Query("{ 'users' : ?0 }")
    Optional<List<Chat>> findAllChatByUser(ObjectId id);
}
