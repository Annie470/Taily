package taily_BE.Taily.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.userdetails.UserDetails;
import taily_BE.Taily.entities.enums.Role;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Logable implements UserDetails {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    protected UUID id;
    protected  String email;
    protected  String password;
    @Enumerated(EnumType.STRING)
    protected Role role;

    // USER
    public Logable(String email, String password) {
        this.email = email;
        this.password = password;
        this.role = Role.USER;
    }

    // ADMIN, CHAIRMAN
    public Logable(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
