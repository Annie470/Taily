package taily_BE.Taily.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = {"author_id", "post_id"})})
@Data
@NoArgsConstructor
public class Report {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false, length = 500)
    private String text;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnoreProperties({"friends", "posts", "guests", "password", "authorities"})
    private DogOwner author;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties({"guests"})
    private Post post;

    @Column(nullable = false)
    private LocalDateTime createdInDate;

    public Report(String text, DogOwner author, Post post) {
        this.text = text;
        this.author = author;
        this.post = post;
        this.createdInDate = LocalDateTime.now();
    }
}