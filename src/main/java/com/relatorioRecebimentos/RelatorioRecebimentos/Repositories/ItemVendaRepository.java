package com.relatorioRecebimentos.RelatorioRecebimentos.Repositories;

import com.relatorioRecebimentos.RelatorioRecebimentos.DTOs.RelatorioRecebimentoDTO;
import com.relatorioRecebimentos.RelatorioRecebimentos.Models.ItemVendaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVendaModel, Long> {

    @Query("SELECT DISTINCT new com.relatorioRecebimentos.RelatorioRecebimentos.DTOs.RelatorioRecebimentoDTO(" +
            "    v.dataPagamento, " +
            "    v.formaPagamento, " +
            "    v.valorVenda, " +
            "    pf.nomePessoa, " +
            "    proc.descricaoProcedimento, " +
            "    pc.tipoPlano, " +
            "    pc.descricaoPlano" +
            ") " +
            "FROM VendaModel v " +
            "JOIN v.itens iv " +
            "JOIN iv.movContabilModels mc " +
            "JOIN mc.planoContaModel pc " +
            "JOIN iv.profissionalModel prof " +
            "JOIN prof.pessoaFisicaModel pf " +
            "JOIN iv.procedimentoModel proc " +
            "WHERE v.dataPagamento BETWEEN :dataInicial AND :dataFinal " +
            "AND (:formaPagamento IS NULL OR v.formaPagamento = :formaPagamento) " +
            "AND (:tipoPlano IS NULL OR pc.tipoPlano = :tipoPlano)")
    List<RelatorioRecebimentoDTO> gerarRelatorioRecebimento(
            @Param("dataInicial") LocalDateTime dataInicial,
            @Param("dataFinal") LocalDateTime dataFinal,
            @Param("formaPagamento") String formaPagamento,
            @Param("tipoPlano") String tipoPlano
    );

}
