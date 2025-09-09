package com.relatorioRecebimentos.RelatorioRecebimentos.Models;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = ProcedimentoModel.TABLE_NAME)
public class ProcedimentoModel {
    public static final String TABLE_NAME = "PROCEDIMENTO";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROCED", unique = true, nullable = false)
    private Long id_procedimento;

    @Column(name = "CODPROCED", nullable = false)
    private String codigoProcedimento;

    @Column(name = "DESCRPROC", nullable = false)
    private String descricaoProcedimento;

    @Column(name = "VALORPROC", nullable = false)
    private Double valorProcedimento;

    //RELACIONAMENTOS
    @OneToMany(mappedBy = "procedimentoModel")
    @JsonBackReference
    @ToString.Exclude
    private List<ItemVendaModel> itens;

}
