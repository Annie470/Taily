package taily_BE.Taily.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import taily_BE.Taily.entities.Provincia;
import taily_BE.Taily.repositories.ProvinciaRepository;

@Service
public class ProvinciaService {

    @Autowired
    private ProvinciaRepository provinciaRepository;

    public long count() {
        return provinciaRepository.count();
    }

    public Provincia save(Provincia provincia) {
        return provinciaRepository.save(provincia);
    }

    public Provincia findBySiglaProvincia(String siglaProvincia) {
        return provinciaRepository.findById(siglaProvincia).orElse(null);
    }
}