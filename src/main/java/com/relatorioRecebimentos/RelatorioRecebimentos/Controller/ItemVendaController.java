package com.relatorioRecebimentos.RelatorioRecebimentos.Controller;

import com.relatorioRecebimentos.RelatorioRecebimentos.Models.ItemVendaModel;
import com.relatorioRecebimentos.RelatorioRecebimentos.Services.ItemVendaServices;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/item-venda")
public class ItemVendaController {

    private final ItemVendaServices itemVendaServices;

    public ItemVendaController(ItemVendaServices itemVendaServices){
        this.itemVendaServices = itemVendaServices;
    }

    @GetMapping("/listar")
    public List<ItemVendaModel> listarItens(){
        return itemVendaServices.listar();
    }
}
