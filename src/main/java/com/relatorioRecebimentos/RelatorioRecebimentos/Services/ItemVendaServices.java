package com.relatorioRecebimentos.RelatorioRecebimentos.Services;

import com.relatorioRecebimentos.RelatorioRecebimentos.Models.ItemVendaModel;
import com.relatorioRecebimentos.RelatorioRecebimentos.Repositories.ItemVendaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemVendaServices {
    //Dependência e Import
    private final ItemVendaRepository repository;
    public ItemVendaServices(ItemVendaRepository repository){
        this.repository = repository;
    }

    public List<ItemVendaModel> listar(){
        return repository.findAll();
    }

}
