package taily_BE.Taily.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comuni")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comune {

    @Id
    @Column(name = "codice_istat", length = 6, nullable = false)
    private String codiceIstat;

    @Column(name = "denominazione_ita", length = 100, nullable = false)
    private String denominazioneIta;

    @Column(name = "denominazione_ita_altra", length = 100)
    private String denominazioneItaAltra;

    @Column(name = "denominazione_altra", length = 100)
    private String denominazioneAltra;

    @ManyToOne
    @JoinColumn(name = "sigla_provincia", nullable = false)
    @JsonIgnoreProperties("comuni")
    private Provincia provincia;
}