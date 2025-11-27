package taily_BE.Taily.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import taily_BE.Taily.entities.enums.Age;
import taily_BE.Taily.entities.enums.Sex;
import taily_BE.Taily.entities.enums.Size;

public record PutDogOwnerDTO(
        @Email
        @NotBlank
        String email,
        @NotBlank
        String username,
        @NotBlank
        String dogName,
        @NotNull
        Age age,
        String bio,
        String sex
) {
}
