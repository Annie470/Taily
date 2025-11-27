package taily_BE.Taily.payloads;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ReportDTO(
        @NotEmpty
        @Size(max = 500, message = "Max 500 caratteri")
        String text,
        @NotNull
        UUID postId
) {
}