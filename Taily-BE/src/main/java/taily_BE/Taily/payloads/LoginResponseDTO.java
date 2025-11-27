package taily_BE.Taily.payloads;

import taily_BE.Taily.entities.enums.Role;

public record LoginResponseDTO(
        String accessToken,
        Role role) {
}