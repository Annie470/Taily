package taily_BE.Taily.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import taily_BE.Taily.entities.enums.Age;
import taily_BE.Taily.entities.enums.Sex;
import taily_BE.Taily.entities.enums.Size;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"password"})
public class DogOwner extends Logable {
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String dogName;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Sex sex;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Size size;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Age age;
    @Column(length = 120)
    private String bio;
    private String avatar;

    @ManyToMany(fetch= FetchType.EAGER)
    @JoinTable(
            name = "dog_owner_friends",
            joinColumns = @JoinColumn(name = "dog_owner_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    @JsonIgnoreProperties("friends")
    private List<DogOwner> friends = new ArrayList<>();


    public DogOwner(String email, String password){
        super(email, password);
    }
    public DogOwner(String email, String password, String username, String dogName, Sex sex, Size size, Age age, String bio) {
        super(email, password);
        this.username = username;
        this.dogName = dogName;
        this.sex = sex;
        this.size = size;
        this.age = age;
        this.bio = bio;
        this.friends = new ArrayList<>();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }
}
