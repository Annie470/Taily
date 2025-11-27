package taily_BE.Taily.entities;



import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "province")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Provincia {
    @Id
    @Column(name = "sigla_provincia", length = 2, nullable = false)
    private String siglaProvincia;

    @Column(name = "codice_regione", length = 2, nullable = false)
    private String codiceRegione;

    @Column(name = "denominazione_provincia", length = 100, nullable = false)
    private String denominazioneProvincia;

    @OneToMany(mappedBy = "provincia", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("provincia")
    // CascadeType -> su ALL forza a propagare automaticamente ai Comuni associati le operazione di inserimento, aggiornamento, cancellazione eseguite su Provincia
    //FetchType -> stabilisce con  LAZY che i dati vengano caricati solo quando sono necessari
    private List<Comune> comuni = new ArrayList<>();
}