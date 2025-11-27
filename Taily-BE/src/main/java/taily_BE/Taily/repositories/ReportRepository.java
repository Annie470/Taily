package taily_BE.Taily.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Post;
import taily_BE.Taily.entities.Report;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    boolean existsByAuthorAndPost(DogOwner author, Post post);

    Optional<Report> findByAuthorAndPost(DogOwner author, Post post);

    @Transactional
    void deleteByPost(Post post);
}