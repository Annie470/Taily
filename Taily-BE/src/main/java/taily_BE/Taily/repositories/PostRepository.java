package taily_BE.Taily.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID>, JpaSpecificationExecutor<Post> {

    List<Post> findByDateBefore(LocalDateTime currentDate);
    void deleteByDateBefore(LocalDateTime currentDate);

    List<Post> findByAuthor(DogOwner author);

    @Modifying
    @Query(value = "DELETE FROM post_guest WHERE dog_owner_id = :userId", nativeQuery = true)
    void removeGuestFromAllPosts(@Param("userId") UUID userId);

    @Modifying
    @Query("DELETE FROM Post p WHERE p.date < :currentDate")
    void deleteAllByDateBefore(@Param("currentDate") LocalDateTime currentDate); //fa la stessa cosa

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN p.guests g WHERE p.author.id = :userId OR g.id = :userId")
    List<Post> findPostsByAuthorOrParticipant(@Param("userId") UUID userId);

    Optional<Post> findById(UUID id);


        @Query("SELECT p FROM Post p LEFT JOIN FETCH p.guests WHERE p.id = :postId")
        Optional<Post> findByIdWithGuests(@Param("postId") UUID postId);


}
