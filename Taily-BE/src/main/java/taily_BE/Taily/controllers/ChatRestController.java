package taily_BE.Taily.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import taily_BE.Taily.entities.ChatMessage;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Post;
import taily_BE.Taily.exceptions.NotFoundException;
import taily_BE.Taily.exceptions.UnauthorizedException;
import taily_BE.Taily.payloads.ChatDTO;
import taily_BE.Taily.repositories.ChatMessageRepository;
import taily_BE.Taily.repositories.PostRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/posts/{postId}/chat")
public class ChatRestController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private PostRepository postRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<ChatDTO> getChatHistory(
            @PathVariable UUID postId,
            @AuthenticationPrincipal DogOwner currentUser
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post non trovato"));

        boolean isParticipant = post.getAuthor().getId().equals(currentUser.getId()) ||
                post.getGuests().stream().anyMatch(g -> g.getId().equals(currentUser.getId()));

        if (!isParticipant) {
            throw new UnauthorizedException("Non sei partecipante");
        }
//        return chatMessageRepository.findByPostOrderByTimestampAsc(post);
        List<ChatMessage> messages = chatMessageRepository.findByPostOrderByTimestampAsc(post);
        return messages.stream()
                .map(msg -> new ChatDTO(
                        msg.getId(),
                        msg.getPost().getId(),
                        msg.getSender().getId(),
                        msg.getSender().getUsername(),
                        msg.getText(),
                        msg.getTimestamp()
                ))
                .toList();
    }
}
