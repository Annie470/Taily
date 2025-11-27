package taily_BE.Taily.payloads;

import java.time.LocalDateTime;

public record ErrorsDTO(
        String message,
        LocalDateTime date) {}
