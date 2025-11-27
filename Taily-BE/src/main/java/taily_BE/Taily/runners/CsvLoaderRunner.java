package taily_BE.Taily.runners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import taily_BE.Taily.entities.Comune;
import taily_BE.Taily.entities.Provincia;
import taily_BE.Taily.services.ComuneService;
import taily_BE.Taily.services.ProvinciaService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
public class CsvLoaderRunner implements CommandLineRunner {

    @Autowired
    private ProvinciaService provinciaService;

    @Autowired
    private ComuneService comuneService;

    private void loadProvince() {
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new ClassPathResource("csv/gi_province.csv").getInputStream()))) {

            br.readLine(); // salta intestazione
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(";");
                if (data.length >= 3) {
                    Provincia provincia = new Provincia();
                    provincia.setCodiceRegione(data[0].trim());
                    provincia.setSiglaProvincia(data[1].trim());
                    provincia.setDenominazioneProvincia(data[2].trim());

                    provinciaService.save(provincia);
                }
            }

        } catch (IOException e) {
            System.err.println("Errore durante il caricamento delle province");
            e.printStackTrace();
        }
    }

    private void loadComuni() {
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new ClassPathResource("csv/gi_comuni.csv").getInputStream()))) {

            br.readLine();
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(";");

                if (data.length >= 4) {
                    String siglaProvincia = data[0].trim();
                    String codiceIstat = data[1].trim();
                    String denominazioneItaAltra = data[2].trim();
                    String denominazioneIta = data[3].trim();
                    String denominazioneAltra = data.length > 4 ? data[4].trim() : null;

                    Provincia provincia = provinciaService.findBySiglaProvincia(siglaProvincia.trim().toUpperCase());
                    if (provincia == null) {
                        System.err.println("Provincia non trovata: " + siglaProvincia);
                        continue;
                    }
                    Comune comune = new Comune();
                    comune.setCodiceIstat(codiceIstat);
                    comune.setDenominazioneIta(denominazioneIta);
                    comune.setDenominazioneItaAltra(denominazioneItaAltra.isEmpty() ? null : denominazioneItaAltra);
                    comune.setDenominazioneAltra(denominazioneAltra == null || denominazioneAltra.isEmpty() ? null : denominazioneAltra);
                    comune.setProvincia(provincia);

                    comuneService.save(comune);
                }
            }

        } catch (IOException e) {
            System.err.println("Errore durante il caricamento dei comuni");
            e.printStackTrace();
        }
    }

    @Override
    public void run(String... args) throws Exception {
        if (provinciaService.count() == 0) {
            loadProvince();
            System.out.println("Province caricate con successo!");
        }

        if (comuneService.count() == 0) {
            loadComuni();
            System.out.println("Comuni caricati con successo!");
        }
    }
}
