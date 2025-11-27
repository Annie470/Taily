package taily_BE.Taily.payloads;


import java.time.LocalDateTime;
import java.util.UUID;

public record ChatDTO(
        UUID id,
        UUID postId,
        UUID senderId,
        String senderUsername,
        String text,
        LocalDateTime timestamp
) {}