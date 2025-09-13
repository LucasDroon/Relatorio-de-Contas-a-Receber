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
@Table(name = ItemVendaModel.TABLE_NAME)
public class ItemVendaModel {
    public static final String TABLE_NAME = "ITEMVENDA";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDITEMVENDA", unique = true, nullable = false)
    private Long id_item_venda;

    // RELACIONAMENTO
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ID_VENDA")
    @JsonManagedReference
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ToString.Exclude
    private VendaModel vendaModel;


    @Column(name = "QTDITEM", nullable = false)
    private long quantidadeItem;

    @Column(name = "ID_ESPEC", nullable = false)
    private long id_especialidade;

    // RELACIONAMENTO
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ID_PRECED")
    @JsonManagedReference
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ToString.Exclude
    private ProcedimentoModel procedimentoModel;

    // RELACIONAMENTO
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ID_PROFISSIO")
    @JsonManagedReference
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ToString.Exclude
    private ProfissionalModel profissionalModel;

    //RELACIONAMENTOS
    @OneToMany(mappedBy = "itemVendaModel")
    @JsonBackReference
    @ToString.Exclude
    private List<MovContabilModel> movContabilModels;





}
