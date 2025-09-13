package com.relatorioRecebimentos.RelatorioRecebimentos.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor // Construtor com todos os argumentos é essencial para a query
@NoArgsConstructor
public class RelatorioRecebimentoDTO {

    private LocalDateTime dataPagamento;
    private String formaPagamento;
    private Double valorVenda;
    private String nomeProfissional;
    private String descricaoProcedimento;
    private String tipoPlanoConta;
    private String descricaoPlanoConta;

}