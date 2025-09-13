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
@Table(name = PlanoContaModel.TABLE_NAME)
public class PlanoContaModel {
    public static final String TABLE_NAME = "PLANOCONTA";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPLANOCONTA", unique = true, nullable = false)
    private Long id_plano_conta;

    @Column(name = "CODPLANO", nullable = false)
    private Long id_pessoa;

    @Column(name = "TIPO", nullable = false)
    private String tipoPlano;

    @Column(name = "DESCRICAO", nullable = false)
    private String descricaoPlano;

    // RELACIONAMENTOS
    @OneToMany(mappedBy = "planoContaModel")
    private List<MovContabilModel> movimentacoesContabeis;

}
