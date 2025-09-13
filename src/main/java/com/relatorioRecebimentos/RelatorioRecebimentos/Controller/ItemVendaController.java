package com.relatorioRecebimentos.RelatorioRecebimentos.Controller;

import com.relatorioRecebimentos.RelatorioRecebimentos.DTOs.RelatorioRecebimentoDTO;
import com.relatorioRecebimentos.RelatorioRecebimentos.Models.ItemVendaModel;
import com.relatorioRecebimentos.RelatorioRecebimentos.Services.ItemVendaServices;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/item-venda")
@CrossOrigin(origins = "*")
public class ItemVendaController {

    private final ItemVendaServices itemVendaServices;

    public ItemVendaController(ItemVendaServices itemVendaServices){
        this.itemVendaServices = itemVendaServices;
    }

    @GetMapping("/listar")
    public List<ItemVendaModel> listarItens(){
        return itemVendaServices.listar();
    }

    @GetMapping("/relatorio")
    public ResponseEntity<List<RelatorioRecebimentoDTO>> getRelatorioRecebimentos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicial,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFinal,
            @RequestParam(required = false) String formaPagamento,
            @RequestParam(required = false) String tipoPlano) {

        List<RelatorioRecebimentoDTO> relatorio = itemVendaServices.gerarRelatorio(
                dataInicial, dataFinal, formaPagamento, tipoPlano
        );
        return ResponseEntity.ok(relatorio);
    }
}