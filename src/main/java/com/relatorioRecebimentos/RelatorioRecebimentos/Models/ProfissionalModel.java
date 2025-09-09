package com.relatorioRecebimentos.RelatorioRecebimentos.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = ProfissionalModel.TABLE_NAME)
public class ProfissionalModel {
    public static final String TABLE_NAME = "PROFISSIONAL";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROFISSIO", unique = true, nullable = false)
    private Long id_profissional;

    // RELACIONAMENTO
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ID_PESSOAFIS")
    @JsonManagedReference
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ToString.Exclude
    private PessoaFisicaModel pessoaFisicaModel;

    @Column(name = "TIPOPROFI", nullable = false)
    private String tipoProfissional;

    @Column(name = "ID_SUPPROFI", nullable = false)
    private Double id_suporte_profissional;

    @Column(name = "STATUSPROFI", nullable = false)
    private String statusProfissional;

    @Column(name = "ID_CONSEPROFI", nullable = false)
    private int id_conse_profissional;

    //RELACIONAMENTOS
    @OneToMany(mappedBy = "profissionalModel")
    @JsonBackReference
    @ToString.Exclude
    private List<ItemVendaModel> itens;

}
