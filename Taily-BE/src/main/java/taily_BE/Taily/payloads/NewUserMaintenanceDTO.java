package taily_BE.Taily.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record NewUserMaintenanceDTO(
        @Email
        @NotBlank
        String email,
        @NotBlank
        @Pattern(regexp = "^(?=.*[A-Z])(?=(?:.*\\d.*){2}).{8,}$", message = "La password deve contenere almeno 8 caratteri, una lettera maiuscola e due numeri")
        String password,
        @NotBlank
        String fullName
) {
}
