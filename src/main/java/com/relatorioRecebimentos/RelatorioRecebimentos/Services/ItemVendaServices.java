package com.relatorioRecebimentos.RelatorioRecebimentos.Services;

import com.relatorioRecebimentos.RelatorioRecebimentos.DTOs.RelatorioRecebimentoDTO;
import com.relatorioRecebimentos.RelatorioRecebimentos.Models.ItemVendaModel;
import com.relatorioRecebimentos.RelatorioRecebimentos.Repositories.ItemVendaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ItemVendaServices {
    private final ItemVendaRepository repository;

    public ItemVendaServices(ItemVendaRepository repository){
        this.repository = repository;
    }

    public List<ItemVendaModel> listar(){
        return repository.findAll();
    }

    public List<RelatorioRecebimentoDTO> gerarRelatorio(
            LocalDateTime dataInicial, LocalDateTime dataFinal,
            String formaPagamento, String tipoPlano) {

        LocalDateTime dataFinalAjustada = dataFinal.with(LocalTime.MAX);
        String formaPagamentoFiltro = "all".equalsIgnoreCase(formaPagamento) ? null : formaPagamento;
        String tipoPlanoFiltro = "all".equalsIgnoreCase(tipoPlano) ? null : tipoPlano;

        return repository.gerarRelatorioRecebimento(
                dataInicial, dataFinalAjustada, formaPagamentoFiltro, tipoPlanoFiltro
        );
    }
}