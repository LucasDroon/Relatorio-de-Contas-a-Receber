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
@Table(name = VendaModel.TABLE_NAME)
public class VendaModel {
    public static final String TABLE_NAME = "VENDA";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDVENDA", unique = true, nullable = false)
    private Long id_venda;

    @Column(name = "ID_PESSOA", nullable = false)
    private Long id_pessoa;

    @Column(name = "VALORVENDA", nullable = false)
    private Double valorVenda;

    @Column(name = "DATAPAG", nullable = false)
    private LocalDateTime dataPagamento;

    @Column(name = "FORMPAG", nullable = false)
    private String formaPagamento;

    //RELACIONAMENTOS
    @OneToMany(mappedBy = "vendaModel")
    @JsonBackReference
    @ToString.Exclude
    private List<ItemVendaModel> itens;

}
