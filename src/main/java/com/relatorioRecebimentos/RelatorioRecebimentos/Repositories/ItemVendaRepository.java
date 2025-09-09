package com.relatorioRecebimentos.RelatorioRecebimentos.Repositories;

import com.relatorioRecebimentos.RelatorioRecebimentos.Models.ItemVendaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVendaModel, Long> {


}
