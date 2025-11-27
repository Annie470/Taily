
package taily_BE.Taily.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import taily_BE.Taily.entities.Comune;
import taily_BE.Taily.repositories.ComuneRepository;

@Service
public class ComuneService {

    @Autowired
    private ComuneRepository comuneRepository;

    public long count() {
        return comuneRepository.count();
    }

    public Comune save(Comune comune) {
        return comuneRepository.save(comune);
    }
}