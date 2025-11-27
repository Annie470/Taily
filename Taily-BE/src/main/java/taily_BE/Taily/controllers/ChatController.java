package taily_BE.Taily.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Controller;
import taily_BE.Taily.entities.ChatMessage;
import taily_BE.Taily.entities.DogOwner;

import taily_BE.Taily.entities.Post;
import taily_BE.Taily.exceptions.NotFoundException;
import taily_BE.Taily.exceptions.UnauthorizedException;
import taily_BE.Taily.payloads.ChatDTO;
import taily_BE.Taily.repositories.ChatMessageRepository;
import taily_BE.Taily.repositories.DogOwnerRepository;
import taily_BE.Taily.repositories.PostRepository;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Controller
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private DogOwnerRepository dogOwnerRepository;

    @MessageMapping("/chat/{postId}")
    @SendTo("/topic/chat/{postId}")
    public ChatDTO sendMessage(
            @DestinationVariable UUID postId,
            @Payload Map<String, String> payload,
            SimpMessageHeaderAccessor headerAccessor) {

        UsernamePasswordAuthenticationToken auth =
                (UsernamePasswordAuthenticationToken) headerAccessor.getSessionAttributes().get("user");

        if (auth == null) {
            throw new UnauthorizedException("Utente non autenticato");
        }

        DogOwner sender = (DogOwner) auth.getPrincipal();
        Post post = postRepository.findByIdWithGuests(postId)
                .orElseThrow(() -> new NotFoundException("Post non trovato"));

        boolean isParticipant = post.getAuthor().getId().equals(sender.getId()) ||
                post.getGuests().stream().anyMatch(g -> g.getId().equals(sender.getId()));

        if (!isParticipant) {
            throw new UnauthorizedException("Non sei partecipante");
        }

        ChatMessage message = new ChatMessage(post, sender, payload.get("content"));
        ChatMessage saved = chatMessageRepository.save(message);

        return new ChatDTO(
                saved.getId(),
                saved.getPost().getId(),
                saved.getSender().getId(),
                saved.getSender().getUsername(),
                saved.getText(),
                saved.getTimestamp()
        );
    }




}
