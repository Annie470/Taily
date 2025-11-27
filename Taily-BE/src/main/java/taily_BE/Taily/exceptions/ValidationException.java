package taily_BE.Taily.exceptions;

import lombok.Getter;

import java.util.List;

@Getter
public class ValidationException extends RuntimeException {
    private List<String> errors;

    public ValidationException(List<String> errors) {
        super("Errori nella validazoione del payload");
        this.errors = errors;
    }
}
