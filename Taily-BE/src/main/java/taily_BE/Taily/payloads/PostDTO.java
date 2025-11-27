package taily_BE.Taily.payloads;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import taily_BE.Taily.entities.Comune;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.enums.Age;
import taily_BE.Taily.entities.enums.Sex;
import taily_BE.Taily.entities.enums.Size;

import java.time.LocalDateTime;

public record PostDTO (
        @NotBlank
        String street,

        @NotNull
        @FutureOrPresent
        LocalDateTime date,

        @NotBlank
        String codiceIstat,

        String note,

     Sex allowedDogSex,
     Size allowedDogSize,
     Age allowedDogAge

    ){ }