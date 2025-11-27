package taily_BE.Taily.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import taily_BE.Taily.payloads.ComuneDTO;
import taily_BE.Taily.payloads.ProvinciaDTO;
import taily_BE.Taily.services.LocationService;

import java.util.List;

@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationService locationService;

    // GET ALL PROVINCE
    @GetMapping("/province")
    public List<ProvinciaDTO> getAllProvince() {
        return locationService.getAllProvince();
    }

    // GET ALL COMUNI DI PROVINCIA
    @GetMapping("/comuni")
    public List<ComuneDTO> getComuniByProvincia(@RequestParam String siglaProvincia) {
        return locationService.getComuniByProvincia(siglaProvincia);
    }
}
