package taily_BE.Taily.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.UserMaintenance;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserMaintenanceRepository extends JpaRepository<UserMaintenance, UUID> {

    Optional<UserMaintenance> findById(UUID id);
    Optional<UserMaintenance> findByEmail(String email);
    boolean existsByEmail(String email);
}
