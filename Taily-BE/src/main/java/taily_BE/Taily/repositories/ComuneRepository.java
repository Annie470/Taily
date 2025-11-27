
package taily_BE.Taily.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import taily_BE.Taily.entities.Comune;

import java.util.List;

@Repository
public interface ComuneRepository extends JpaRepository<Comune, String> {
    List<Comune> findByProvincia_SiglaProvinciaOrderByDenominazioneItaAsc(
            String siglaProvincia
    );
}