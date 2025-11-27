package team5.BW_CMR.payloads;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorsListDTO (
        String message,
        LocalDateTime timestamp,
        List<String> errors) {
}