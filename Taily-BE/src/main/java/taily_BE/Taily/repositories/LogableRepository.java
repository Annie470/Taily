package taily_BE.Taily.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import taily_BE.Taily.entities.Logable;

import java.util.Optional;
import java.util.UUID;

public interface LogableRepository extends JpaRepository<Logable, UUID> {

    Optional<Logable> findById(UUID id);
    Optional<Logable> findByEmail(String email);
    boolean existsByEmail(String email);

}
