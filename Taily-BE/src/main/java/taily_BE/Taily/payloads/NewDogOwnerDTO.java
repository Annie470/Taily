package taily_BE.Taily.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import taily_BE.Taily.entities.enums.Age;
import taily_BE.Taily.entities.enums.Sex;
import taily_BE.Taily.entities.enums.Size;

public record NewDogOwnerDTO(
        @Email
        @NotBlank
        String email,
        @NotBlank
        @Pattern(regexp = "^(?=.*[A-Z])(?=(?:.*\\d.*){2}).{8,}$", message = "La password deve contenere almeno 8 caratteri, una lettera maiuscola e due numeri")
        String password,
        @NotBlank
        String username,
        @NotBlank
        String dogName,
        @NotNull
        Sex sex,
        @NotNull
        Size size,
        @NotNull
        Age age,
        String bio
) {
}
