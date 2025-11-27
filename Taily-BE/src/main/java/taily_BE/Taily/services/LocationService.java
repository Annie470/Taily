package taily_BE.Taily.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import taily_BE.Taily.payloads.ComuneDTO;
import taily_BE.Taily.payloads.ProvinciaDTO;
import taily_BE.Taily.repositories.ComuneRepository;
import taily_BE.Taily.repositories.ProvinciaRepository;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private ProvinciaRepository provinciaRepository;

    @Autowired
    private ComuneRepository comuneRepository;

    public List<ProvinciaDTO> getAllProvince() {
        return provinciaRepository.findAll().stream().map(p -> new ProvinciaDTO(p.getSiglaProvincia(), p.getDenominazioneProvincia())).toList();
    }

    public List<ComuneDTO> getComuniByProvincia(String siglaProvincia) {
        siglaProvincia = siglaProvincia.trim().toUpperCase();

        return comuneRepository.findByProvincia_SiglaProvinciaOrderByDenominazioneItaAsc(siglaProvincia)
                .stream()
                .map(c -> new ComuneDTO(
                        c.getCodiceIstat(),
                        c.getDenominazioneIta(),
                        c.getProvincia().getSiglaProvincia()))
                .toList();
    }
}
