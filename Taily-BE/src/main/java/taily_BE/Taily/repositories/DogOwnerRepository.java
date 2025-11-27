package taily_BE.Taily.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Logable;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DogOwnerRepository extends JpaRepository<DogOwner, UUID> {

    Optional<DogOwner> findById(UUID id);
    Optional<DogOwner> findByEmail(String email);
    Optional<DogOwner> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
