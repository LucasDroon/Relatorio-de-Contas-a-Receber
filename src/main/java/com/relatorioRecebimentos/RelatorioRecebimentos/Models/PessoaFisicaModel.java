package com.relatorioRecebimentos.RelatorioRecebimentos.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = PessoaFisicaModel.TABLE_NAME)
public class PessoaFisicaModel {
    public static final String TABLE_NAME = "PESSOAFIS";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPESSOAFIS", unique = true, nullable = false)
    private Long id_pessoa_fisica;

    @Column(name = "ID_PESSOA", nullable = false)
    private Long id_pessoa;

    @Column(name = "CPFPESSOA", nullable = false)
    private String cpfPessoa;

    @Column(name = "NOMEPESSOA", nullable = false)
    private String nomePessoa;

    @Column(name = "DATANASCPES", nullable = false)
    private LocalDateTime dataNascimento;

    @Column(name = "SEXOPESSOA", nullable = false)
    private String sexoPessoa;


    @Column(name = "DATACRIACAO", nullable = false)
    private LocalDateTime dataCriacao;

    //RELACIONAMENTOS
    @OneToMany(mappedBy = "pessoaFisicaModel")
    @JsonBackReference
    @ToString.Exclude
    private List<ProfissionalModel> profissionalModels;

}
