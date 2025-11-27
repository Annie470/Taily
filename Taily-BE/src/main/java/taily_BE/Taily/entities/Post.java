package taily_BE.Taily.entities;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import taily_BE.Taily.entities.enums.Age;
import taily_BE.Taily.entities.enums.Sex;
import taily_BE.Taily.entities.enums.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(length = 500)
    private String note;

    @ManyToOne
    @JoinColumn(name = "codice_istat", nullable = false)
    private Comune district;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnoreProperties({"friends", "posts", "dogs", "guests"})
    private DogOwner author;

    @ManyToMany
    @JoinTable(name = "post_guest", joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "dog_owner_id"))
    @JsonIgnoreProperties({"friends", "posts", "author", "password", "authorities"})
    private List<DogOwner> guests = new ArrayList<>();

    //FILTER
    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Sex allowedSex;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Size allowedSize;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Age allowedAge;

    public Post(DogOwner author, String street, LocalDateTime date, String note, Comune district, Sex allowedSex, Size allowedSize, Age allowedAge) {
        this.street = street;
        this.date = date;
        this.note = note;
        this.district = district;
        this.author = author;
        this.guests = new ArrayList<>();
        this.allowedSex = allowedSex;
        this.allowedSize = allowedSize;
        this.allowedAge = allowedAge;
    }
}
