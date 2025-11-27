package taily_BE.Taily.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import taily_BE.Taily.entities.ChatMessage;
import taily_BE.Taily.entities.Post;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    List<ChatMessage> findByPostOrderByTimestampAsc(Post post);

    void deleteByPost(Post post);
}
