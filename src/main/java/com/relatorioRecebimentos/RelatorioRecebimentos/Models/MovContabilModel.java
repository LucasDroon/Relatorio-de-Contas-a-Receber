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
@Table(name = MovContabilModel.TABLE_NAME)
public class MovContabilModel {
    public static final String TABLE_NAME = "MOVCONTABIL";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDMOVCONTAB", unique = true, nullable = false)
    private Long id_movimentacao_contabil;

    @Column(name = "NUMELANCAM", nullable = false)
    private Long numeroLancamento;

    @Column(name = "DATALANCAME", nullable = false)
    private String dataLancamento;

    @Column(name = "ID_ORDCOMP", nullable = false)
    private String id_ordem_de_compra;

    @Column(name = "VALDBTO", nullable = false)
    private String valorDebito;

    @Column(name = "VALCDTO", nullable = false)
    private String valorCredito;

    // RELACIONAMENTO
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PLANOCONTA")
    private PlanoContaModel planoContaModel;

    // RELACIONAMENTO
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_ITEMVENDA")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ToString.Exclude
    private ItemVendaModel itemVendaModel;


}
