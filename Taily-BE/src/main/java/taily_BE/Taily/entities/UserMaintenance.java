package taily_BE.Taily.entities;

import jakarta.persistence.Entity;
import lombok.*;
import org.apache.catalina.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import taily_BE.Taily.entities.enums.Role;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class UserMaintenance extends Logable {
    private String fullName;

    public UserMaintenance(String email, String password) {
        super(email, password);
    }


    // CHAIRMAN
    public UserMaintenance(String email, String password, String fullName) {
        super(email, password, Role.CHAIRMAN);
        this.fullName = fullName;
    }

    // ADMIN
    public UserMaintenance(String email, String password, String fullName, Role role) {
        super(email, password, role);
        this.fullName = fullName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    public String getUsername() {
        return this.fullName;
    }
}
