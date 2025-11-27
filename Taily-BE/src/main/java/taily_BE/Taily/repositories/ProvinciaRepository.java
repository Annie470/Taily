package taily_BE.Taily.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import taily_BE.Taily.entities.Provincia;

@Repository
public interface ProvinciaRepository extends JpaRepository<Provincia, String> {
}