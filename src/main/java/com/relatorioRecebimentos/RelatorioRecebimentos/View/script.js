
       try{
        // Rodapé em todas as páginas
        const totalPaginas = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPaginas; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            
            // Data e hora no rodapé esquerdo
            doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, margem, alturaPagina - 10);
            
            // Número da página no rodapé direito
            doc.text(`Página ${i} de ${totalPaginas}`, larguraPagina - margem - 30, alturaPagina - 10);
            
            // Linha no rodapé
            doc.setLineWidth(0.2);
            doc.line(margem, alturaPagina - 15, larguraPagina - margem, alturaPagina - 15);
        }

        // Remover loading
        document.body.removeChild(loadingPDF);
        
        // Salvar o PDF
        const configuracoes = obterConfiguracoes();
        const nomeArquivo = `relatorio-${configuracoes.tipoRelatorio}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nomeArquivo);
        
        // Feedback visual
        mostrarNotificacao('PDF exportado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        
        // Remover loading se ainda existir
        const loadingPDF = document.querySelector('.fixed.inset-0.bg-black');
        if (loadingPDF) {
            document.body.removeChild(loadingPDF);
        }
        
        mostrarNotificacao('Erro ao exportar PDF. Tente novamente.', 'error');
    }


// Função auxiliar para gerar PDF com texto simples
async function gerarPDFTextoSimples(doc, margem, yPos, larguraPagina, alturaPagina) {
    const verificarEspacoPagina = (alturaElemento) => {
        if (yPos + alturaElemento > alturaPagina - margem) {
            doc.addPage();
            yPos = margem + 20;
            return true;
        }
        return false;
    };

    // Título da seção
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 94, 158);
    doc.text('Dados do Relatório', margem, yPos);
    yPos += 12;
    
    // Extrair dados da tabela se existir
    const tabelaElement = document.querySelector('#conteudoRelatorio table tbody');
    if (tabelaElement) {
        const linhas = tabelaElement.querySelectorAll('tr');
        
        // Cabeçalho da tabela
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Data', margem, yPos);
        doc.text('Descrição', margem + 30, yPos);
        doc.text('Profissional', margem + 80, yPos);
        doc.text('Forma Pag.', margem + 120, yPos);
        doc.text('Valor', margem + 150, yPos);
        yPos += 8;
        
        // Linha separadora
        doc.setLineWidth(0.1);
        doc.line(margem, yPos, larguraPagina - margem, yPos);
        yPos += 5;
        
        // Dados da tabela
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        
        linhas.forEach((linha, index) => {
            verificarEspacoPagina(6);
            
            const colunas = linha.querySelectorAll('td');
            if (colunas.length >= 5) {
                const data = new Date(colunas[0].textContent.trim()).toLocaleDateString('pt-BR');
                const descricao = colunas[1].textContent.trim().substring(0, 25) + '...';
                const profissional = colunas[2].textContent.trim().substring(0, 20);
                const formaPag = colunas[3].textContent.trim();
                const valor = colunas[4].textContent.trim();
                
                doc.text(data, margem, yPos);
                doc.text(descricao, margem + 30, yPos);
                doc.text(profissional, margem + 80, yPos);
                doc.text(formaPag, margem + 120, yPos);
                doc.text(valor, margem + 150, yPos);
                yPos += 5;
            }
            
            // Adicionar linha separadora a cada 10 registros
            if ((index + 1) % 10 === 0) {
                doc.setLineWidth(0.05);
                doc.setDrawColor(200, 200, 200);
                doc.line(margem, yPos, larguraPagina - margem, yPos);
                yPos += 3;
            }
        });
        
        // Total final
        const rodapeElement = document.querySelector('#conteudoRelatorio table tfoot');
        if (rodapeElement) {
            verificarEspacoPagina(10);
            yPos += 5;
            doc.setLineWidth(0.2);
            doc.line(margem, yPos, larguraPagina - margem, yPos);
            yPos += 8;
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            const textoTotal = rodapeElement.textContent.trim();
            doc.text(textoTotal, margem, yPos);
        }
    } else {
        // Se não houver tabela, extrair texto do conteúdo
        const textoConteudo = document.getElementById('conteudoRelatorio').textContent || 'Conteúdo do relatório não disponível.';
        const linhasTexto = doc.splitTextToSize(textoConteudo.substring(0, 1000), larguraPagina - (2 * margem));
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        linhasTexto.forEach(linha => {
            verificarEspacoPagina(6);
            doc.text(linha, margem, yPos);
            yPos += 6;
        });
    }
    
    return yPos;
}document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Aplicação iniciada');

    // Verificar se todas as bibliotecas foram carregadas
    verificarDependencias();

    lucide.createIcons();
    setupEventListeners();

    // Testar conectividade com o backend
    testarConectividade();
});

// NOVO: Verificar se as dependências foram carregadas
function verificarDependencias() {
    const dependencias = {
        'Lucide Icons': typeof lucide !== 'undefined',
        'Chart.js': typeof Chart !== 'undefined',
        'jsPDF': typeof window.jspdf !== 'undefined',
        'html2canvas': typeof html2canvas !== 'undefined'
    };

    console.log('📦 Verificação de dependências:', dependencias);

    const faltando = Object.entries(dependencias)
        .filter(([nome, carregado]) => !carregado)
        .map(([nome]) => nome);

    if (faltando.length > 0) {
        console.warn('⚠️ Dependências não carregadas:', faltando);
        mostrarNotificacao(`Algumas bibliotecas não foram carregadas: ${faltando.join(', ')}`, 'warning');
    }
}

// NOVO: Testar conectividade com o backend
async function testarConectividade() {
    try {
        console.log('🔌 Testando conectividade com o backend...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${API_BASE_URL}/item-venda/relatorio?dataInicial=2024-01-01T00:00:00&dataFinal=2024-01-02T23:59:59`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            console.log('✅ Backend conectado com sucesso');
            mostrarNotificacao('Backend conectado e funcionando', 'success', 3000);
        } else {
            console.warn('⚠️ Backend respondeu com erro:', response.status);
            mostrarNotificacao(`Backend respondeu com código ${response.status}`, 'warning', 4000);
        }

    } catch (error) {
        console.warn('⚠️ Não foi possível conectar ao backend:', error.message);

        if (error.name === 'AbortError') {
            mostrarNotificacao('Backend demorou para responder (timeout)', 'warning', 5000);
        } else {
            mostrarNotificacao('Backend não está acessível. Use o botão "Testar com Dados Mock" para ver o funcionamento.', 'info', 8000);
        }
    }
}

// AJUSTE: URL da API centralizada para fácil manutenção
const API_BASE_URL = 'http://localhost:8080';

function setupEventListeners() {
    // Mapeamento de elementos para evitar repetição
    const periodoFilter = document.getElementById('periodoFilter');
    const customDateRange = document.getElementById('customDateRange');
    const gerarRelatorioBtn = document.getElementById('gerarRelatorio');
    const novoRelatorioBtn = document.getElementById('novoRelatorio');
    const salvarPDFBtn = document.getElementById('salvarPDF');
    const areaRelatorio = document.getElementById('areaRelatorio');

    // Verificar se os elementos existem
    console.log('🔍 Verificando elementos da página:', {
        periodoFilter: !!periodoFilter,
        customDateRange: !!customDateRange,
        gerarRelatorioBtn: !!gerarRelatorioBtn,
        novoRelatorioBtn: !!novoRelatorioBtn,
        salvarPDFBtn: !!salvarPDFBtn,
        areaRelatorio: !!areaRelatorio
    });

    if (!gerarRelatorioBtn) {
        console.error('❌ Botão "Gerar Relatório" não encontrado!');
        return;
    }

    periodoFilter.addEventListener('change', () => {
        customDateRange.classList.toggle('hidden', periodoFilter.value !== 'custom');
        console.log('📅 Período alterado para:', periodoFilter.value);
    });

    // Adicionar evento com debug
    gerarRelatorioBtn.addEventListener('click', (e) => {
        console.log('🖱️ Botão "Gerar Relatório" clicado');
        e.preventDefault();
        gerarRelatorio();
    });

    if (novoRelatorioBtn) {
        novoRelatorioBtn.addEventListener('click', () => {
            console.log('🔄 Novo relatório solicitado');
            areaRelatorio.classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // NOVO: Event listener para exportar PDF
    if (salvarPDFBtn) {
        salvarPDFBtn.addEventListener('click', (e) => {
            console.log('💾 Export PDF solicitado');
            e.preventDefault();
            exportarPDF();
        });
    }

    // NOVO: Adicionar botão de teste
    adicionarBotaoTeste();
}

// NOVO: Função para adicionar botão de teste com dados mock
function adicionarBotaoTeste() {
    const gerarRelatorioBtn = document.getElementById('gerarRelatorio');
    if (!gerarRelatorioBtn) return;

    const botaoTeste = document.createElement('button');
    botaoTeste.id = 'testarRelatorio';
    botaoTeste.className = 'ml-4 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl';
    botaoTeste.innerHTML = `
        <i data-lucide="test-tube" class="w-5 h-5 inline mr-2"></i>
        Testar com Dados Mock
    `;

    botaoTeste.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🧪 Teste com dados mock iniciado');
        testarComDadosMock();
    });

    gerarRelatorioBtn.parentNode.appendChild(botaoTeste);
    lucide.createIcons();
}

// NOVO: Função de teste com dados simulados
function testarComDadosMock() {
    console.log('🧪 Gerando relatório com dados de teste...');

    const loading = document.getElementById('loading');
    const areaRelatorio = document.getElementById('areaRelatorio');

    loading.classList.remove('hidden');
    areaRelatorio.classList.add('hidden');

    // Simular delay da API
    setTimeout(() => {
        const dadosMock = [
            {
                id: 1,
                dataPagamento: "2024-01-15T10:30:00",
                tipoPlanoConta: "RC",
                descricaoPlanoConta: "Receita de Serviços",
                nomeProfissional: "João Silva",
                formaPagamento: "PIX",
                valorVenda: 150.00
            },
            {
                id: 2,
                dataPagamento: "2024-01-16T14:20:00",
                tipoPlanoConta: "RC",
                descricaoPlanoConta: "Receita de Serviços",
                nomeProfissional: "Maria Santos",
                formaPagamento: "Cartão de Crédito",
                valorVenda: 250.00
            },
            {
                id: 3,
                dataPagamento: "2024-01-17T09:15:00",
                tipoPlanoConta: "AT",
                descricaoPlanoConta: "Caixa",
                nomeProfissional: "Pedro Oliveira",
                formaPagamento: "Dinheiro",
                valorVenda: 80.00
            },
            {
                id: 4,
                dataPagamento: "2024-01-18T16:45:00",
                tipoPlanoConta: "RC",
                descricaoPlanoConta: "Receita de Serviços",
                nomeProfissional: "Ana Costa",
                formaPagamento: "PIX",
                valorVenda: 320.00
            },
            {
                id: 5,
                dataPagamento: "2024-01-19T11:30:00",
                tipoPlanoConta: "DP",
                descricaoPlanoConta: "Despesas Administrativas",
                nomeProfissional: "Carlos Ferreira",
                formaPagamento: "Transferência",
                valorVenda: 180.00
            }
        ];

        console.log('✅ Dados mock gerados:', dadosMock);

        const configuracoes = obterConfiguracoes();
        renderizarRelatorio(dadosMock, configuracoes);

        loading.classList.add('hidden');
        mostrarNotificacao('Relatório de teste gerado com sucesso!', 'success');

    }, 1500); // Simula 1.5s de loading
}

// NOVO: Função para obter configurações do usuário
function obterConfiguracoes() {
    return {
        tipoRelatorio: document.getElementById('tipoRelatorio').value,
        formato: document.querySelector('input[name="formato"]:checked').value,
        incluirGraficos: document.getElementById('incluirGraficos').checked,
        incluirResumo: document.getElementById('incluirResumo').checked,
        mostrarTendencias: document.getElementById('mostrarTendencias')?.checked || false
    };
}

async function gerarRelatorio() {
    console.log('🔍 Iniciando geração do relatório...');

    const loading = document.getElementById('loading');
    const areaRelatorio = document.getElementById('areaRelatorio');

    // Verificar se os elementos existem
    if (!loading || !areaRelatorio) {
        console.error('❌ Elementos não encontrados:', { loading: !!loading, areaRelatorio: !!areaRelatorio });
        alert('Erro: Elementos da página não encontrados. Recarregue a página.');
        return;
    }

    loading.classList.remove('hidden');
    areaRelatorio.classList.add('hidden');

    // Validação de período personalizado
    if (document.getElementById('periodoFilter').value === 'custom' &&
       (!document.getElementById('dataInicial').value || !document.getElementById('dataFinal').value)) {
        console.warn('⚠️ Datas não selecionadas para período personalizado');
        alert('Por favor, selecione as datas inicial e final para o período personalizado.');
        loading.classList.add('hidden');
        return;
    }

    try {
        // Debug: Mostrar configurações
        const configuracoes = obterConfiguracoes();
        console.log('⚙️ Configurações:', configuracoes);

        const params = new URLSearchParams();
        const { dataInicial, dataFinal } = calcularDatas();
        console.log('📅 Datas calculadas:', { dataInicial, dataFinal });

        params.append('dataInicial', dataInicial);
        params.append('dataFinal', dataFinal);

        const formaPagamento = document.getElementById('formaPagamentoFilter').value;
        if (formaPagamento && formaPagamento !== 'all') {
            params.append('formaPagamento', formaPagamento);
            console.log('💳 Filtro forma pagamento:', formaPagamento);
        }

        const tipoPlano = document.getElementById('tipoPlanoFilter').value;
        if (tipoPlano && tipoPlano !== 'all') {
            params.append('tipoPlano', tipoPlano);
            console.log('📋 Filtro tipo plano:', tipoPlano);
        }

        const apiUrl = `${API_BASE_URL}/item-venda/relatorio?${params.toString()}`;
        console.log("🌐 Chamando API:", apiUrl);
        console.log("📝 Parâmetros:", params.toString());

        // Mostrar notificação de carregamento
        mostrarNotificacao('Buscando dados do servidor...', 'info', 2000);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro na resposta:', errorText);
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}\nDetalhes: ${errorText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            console.error('❌ Resposta não é JSON:', responseText);
            throw new Error(`Resposta inválida do servidor. Esperado JSON, recebido: ${contentType}`);
        }

        const dados = await response.json();
        console.log('✅ Dados recebidos:', dados);
        console.log('📊 Total de registros:', Array.isArray(dados) ? dados.length : 'Não é array');

        if (!dados) {
            throw new Error('Nenhum dado retornado do servidor');
        }

        // Renderizar o relatório
        renderizarRelatorio(dados, configuracoes);

        mostrarNotificacao('Relatório gerado com sucesso!', 'success');

    } catch (error) {
        console.error('❌ Erro completo ao gerar relatório:', error);
        console.error('❌ Stack trace:', error.stack);

        const container = document.getElementById('conteudoRelatorio');
        if (container) {
            let mensagemErro = `<div class="text-center py-8">
                <div class="text-red-500 mb-4">
                    <i data-lucide="alert-circle" class="w-12 h-12 mx-auto mb-2"></i>
                    <h3 class="text-lg font-semibold">Erro ao gerar relatório</h3>
                </div>
                <div class="text-gray-600 space-y-2">
                    <p><strong>Erro:</strong> ${error.message}</p>
                    <p><strong>URL tentativa:</strong> ${API_BASE_URL}/item-venda/relatorio</p>
                    <div class="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm">
                        <strong>Possíveis soluções:</strong>
                        <ul class="mt-2 space-y-1 list-disc list-inside">
                            <li>Verifique se o backend está rodando na porta 8080</li>
                            <li>Confirme se o CORS está configurado no servidor</li>
                            <li>Teste a URL diretamente no navegador</li>
                            <li>Verifique os logs do servidor backend</li>
                        </ul>
                    </div>
                </div>
            </div>`;

            container.innerHTML = mensagemErro;
            lucide.createIcons();
        }

        areaRelatorio.classList.remove('hidden');
        mostrarNotificacao('Erro ao carregar dados do servidor', 'error');

    } finally {
        loading.classList.add('hidden');
        console.log('🏁 Finalizado processo de geração do relatório');
    }
}

function calcularDatas() {
    const periodoFilter = document.getElementById('periodoFilter');
    const dataInicialInput = document.getElementById('dataInicial');
    const dataFinalInput = document.getElementById('dataFinal');
    const hoje = new Date();
    let dataInicial = new Date();

    switch (periodoFilter.value) {
        case '7': dataInicial.setDate(hoje.getDate() - 7); break;
        case '30': dataInicial.setDate(hoje.getDate() - 30); break;
        case '90': dataInicial.setMonth(hoje.getMonth() - 3); break;
        case '365': dataInicial.setFullYear(hoje.getFullYear() - 1); break;
        case 'custom':
            return {
                dataInicial: `${dataInicialInput.value}T00:00:00`,
                dataFinal: `${dataFinalInput.value}T23:59:59`
            };
    }

    const formatar = (data) => data.toISOString().split('T')[0];
    return {
        dataInicial: `${formatar(dataInicial)}T00:00:00`,
        dataFinal: `${formatar(new Date())}T23:59:59`
    };
}

// NOVO: Função principal para renderizar relatório baseado nas configurações
function renderizarRelatorio(dados, configuracoes) {
    const container = document.getElementById('conteudoRelatorio');
    const areaRelatorio = document.getElementById('areaRelatorio');

    if (!dados || dados.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-500 py-8">Nenhum resultado encontrado.</p>`;
        areaRelatorio.classList.remove('hidden');
        return;
    }

    let conteudo = '';

    // Cabeçalho do relatório
    conteudo += gerarCabecalhoRelatorio(dados, configuracoes);

    // Resumo executivo (se habilitado)
    if (configuracoes.incluirResumo) {
        conteudo += gerarResumoExecutivo(dados);
    }

    // Conteúdo principal baseado no formato
    switch (configuracoes.formato) {
        case 'tabela':
            conteudo += gerarTabelaDetalhada(dados, configuracoes);
            break;
        case 'grafico':
            conteudo += gerarAreaGraficos(dados);
            break;
        case 'cards':
            conteudo += gerarCards(dados);
            break;
    }

    // Gráficos adicionais (se habilitados)
    if (configuracoes.incluirGraficos && configuracoes.formato !== 'grafico') {
        conteudo += gerarAreaGraficos(dados);
    }

    container.innerHTML = conteudo;
    areaRelatorio.classList.remove('hidden');
    areaRelatorio.scrollIntoView({ behavior: 'smooth' });

    // Renderizar gráficos se necessário
    if (configuracoes.incluirGraficos || configuracoes.formato === 'grafico') {
        setTimeout(() => renderizarGraficos(dados), 100);
    }
}

function gerarCabecalhoRelatorio(dados, configuracoes) {
    const { dataInicial, dataFinal } = calcularDatas();
    const dataInicialFormatada = new Date(dataInicial).toLocaleDateString('pt-BR');
    const dataFinalFormatada = new Date(dataFinal).toLocaleDateString('pt-BR');
    
    const tipoRelatorioNome = {
        'resumo': 'Resumo Executivo',
        'detalhado': 'Relatório Detalhado',
        'grafico': 'Relatório Gráfico',
        'comparativo': 'Relatório Comparativo'
    };

    return `
        <div class="text-center mb-8 border-b pb-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">${tipoRelatorioNome[configuracoes.tipoRelatorio]}</h1>
            <p class="text-gray-600">Período: ${dataInicialFormatada} a ${dataFinalFormatada}</p>
            <p class="text-sm text-gray-500">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    `;
}

function gerarResumoExecutivo(dados) {
    const totalRegistros = dados.length;
    const valorTotal = dados.reduce((soma, item) => soma + item.valorVenda, 0);
    const valorMedio = valorTotal / totalRegistros;
    
    // Análise por forma de pagamento
    const porFormaPagamento = dados.reduce((acc, item) => {
        acc[item.formaPagamento] = (acc[item.formaPagamento] || 0) + item.valorVenda;
        return acc;
    }, {});

    // Análise por tipo de plano
    const porTipoPlano = dados.reduce((acc, item) => {
        acc[item.tipoPlanoConta] = (acc[item.tipoPlanoConta] || 0) + item.valorVenda;
        return acc;
    }, {});

    // Maior e menor transação
    const valores = dados.map(item => item.valorVenda);
    const maiorTransacao = Math.max(...valores);
    const menorTransacao = Math.min(...valores);

    const formatarMoeda = (valor) => (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return `
        <div class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <i data-lucide="trending-up" class="w-6 h-6 mr-3 text-blue-600"></i>
                Resumo Executivo
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-blue-800 mb-1">Total de Transações</h3>
                            <p class="text-2xl font-bold text-blue-600">${totalRegistros}</p>
                        </div>
                        <i data-lucide="hash" class="w-8 h-8 text-blue-500"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-green-800 mb-1">Valor Total</h3>
                            <p class="text-2xl font-bold text-green-600">${formatarMoeda(valorTotal)}</p>
                        </div>
                        <i data-lucide="dollar-sign" class="w-8 h-8 text-green-500"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-purple-800 mb-1">Ticket Médio</h3>
                            <p class="text-2xl font-bold text-purple-600">${formatarMoeda(valorMedio)}</p>
                        </div>
                        <i data-lucide="calculator" class="w-8 h-8 text-purple-500"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-orange-800 mb-1">Maior Transação</h3>
                            <p class="text-2xl font-bold text-orange-600">${formatarMoeda(maiorTransacao)}</p>
                        </div>
                        <i data-lucide="arrow-up-circle" class="w-8 h-8 text-orange-500"></i>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">Top Formas de Pagamento</h4>
                    <div class="space-y-3">
                        ${Object.entries(porFormaPagamento)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 3)
                            .map(([forma, valor]) => `
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">${forma}</span>
                                    <span class="font-semibold text-gray-800">${formatarMoeda(valor)}</span>
                                </div>
                            `).join('')}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">Top Tipos de Plano</h4>
                    <div class="space-y-3">
                        ${Object.entries(porTipoPlano)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 3)
                            .map(([tipo, valor]) => `
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">${tipo}</span>
                                    <span class="font-semibold text-gray-800">${formatarMoeda(valor)}</span>
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function gerarTabelaDetalhada(dados, configuracoes) {
    const formatarData = (dataString) => new Date(dataString).toLocaleString('pt-BR');
    const formatarMoeda = (valor) => (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const totalRegistros = dados.length;
    const valorTotal = dados.reduce((soma, item) => soma + item.valorVenda, 0);

    const cabecalho = `
        <thead class="bg-gray-100">
            <tr>
                <th class="p-3 text-left text-sm font-semibold text-gray-600">Data Pagamento</th>
                <th class="p-3 text-left text-sm font-semibold text-gray-600">Plano de Contas</th>
                <th class="p-3 text-left text-sm font-semibold text-gray-600">Profissional</th>
                <th class="p-3 text-left text-sm font-semibold text-gray-600">Forma Pag.</th>
                <th class="p-3 text-right text-sm font-semibold text-gray-600">Valor</th>
            </tr>
        </thead>`;

    const linhas = dados.map(item => `
        <tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="p-3 whitespace-nowrap">${formatarData(item.dataPagamento)}</td>
            <td class="p-3">${item.tipoPlanoConta} - ${item.descricaoPlanoConta}</td>
            <td class="p-3">${item.nomeProfissional}</td>
            <td class="p-3">${item.formaPagamento}</td>
            <td class="p-3 text-right font-medium text-gray-800">${formatarMoeda(item.valorVenda)}</td>
        </tr>
    `).join('');

    const rodape = `
        <tfoot class="bg-gray-200 font-bold">
            <tr>
                <td class="p-3" colspan="4">Total de Registros: ${totalRegistros}</td>
                <td class="p-3 text-right">${formatarMoeda(valorTotal)}</td>
            </tr>
        </tfoot>
    `;

    return `
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Dados Detalhados</h2>
            <div class="overflow-x-auto rounded-lg border border-gray-200">
                <table class="w-full">
                    ${cabecalho}
                    <tbody>
                        ${linhas}
                    </tbody>
                    ${rodape}
                </table>
            </div>
        </div>
    `;
}

function gerarCards(dados) {
    const formatarData = (dataString) => new Date(dataString).toLocaleDateString('pt-BR');
    const formatarMoeda = (valor) => (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const cards = dados.map(item => `
        <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-gray-800">${item.nomeProfissional}</h3>
                <span class="text-lg font-bold text-green-600">${formatarMoeda(item.valorVenda)}</span>
            </div>
            <p class="text-sm text-gray-600 mb-1">${item.tipoPlanoConta} - ${item.descricaoPlanoConta}</p>
            <div class="flex justify-between items-center text-sm text-gray-500">
                <span>${item.formaPagamento}</span>
                <span>${formatarData(item.dataPagamento)}</span>
            </div>
        </div>
    `).join('');

    return `
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Transações em Cards</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${cards}
            </div>
        </div>
    `;
}

function gerarAreaGraficos(dados) {
    return `
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Análise Gráfica</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-4 rounded-lg border">
                    <h3 class="text-lg font-medium text-gray-700 mb-3">Vendas por Forma de Pagamento</h3>
                    <canvas id="graficoFormaPagamento" width="400" height="300"></canvas>
                </div>
                <div class="bg-white p-4 rounded-lg border">
                    <h3 class="text-lg font-medium text-gray-700 mb-3">Vendas por Tipo de Plano</h3>
                    <canvas id="graficoTipoPlano" width="400" height="300"></canvas>
                </div>
                <div class="lg:col-span-2 bg-white p-4 rounded-lg border">
                    <h3 class="text-lg font-medium text-gray-700 mb-3">Evolução Temporal</h3>
                    <canvas id="graficoTemporal" width="800" height="300"></canvas>
                </div>
            </div>
        </div>
    `;
}

function renderizarGraficos(dados) {
    // Gráfico por Forma de Pagamento
    const porFormaPagamento = dados.reduce((acc, item) => {
        acc[item.formaPagamento] = (acc[item.formaPagamento] || 0) + item.valorVenda;
        return acc;
    }, {});

    const ctxFormaPagamento = document.getElementById('graficoFormaPagamento');
    if (ctxFormaPagamento) {
        new Chart(ctxFormaPagamento, {
            type: 'pie',
            data: {
                labels: Object.keys(porFormaPagamento),
                datasets: [{
                    data: Object.values(porFormaPagamento),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfico por Tipo de Plano
    const porTipoPlano = dados.reduce((acc, item) => {
        acc[item.tipoPlanoConta] = (acc[item.tipoPlanoConta] || 0) + item.valorVenda;
        return acc;
    }, {});

    const ctxTipoPlano = document.getElementById('graficoTipoPlano');
    if (ctxTipoPlano) {
        new Chart(ctxTipoPlano, {
            type: 'doughnut',
            data: {
                labels: Object.keys(porTipoPlano),
                datasets: [{
                    data: Object.values(porTipoPlano),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfico Temporal
    const vendasPorData = dados.reduce((acc, item) => {
        const data = new Date(item.dataPagamento).toLocaleDateString('pt-BR');
        acc[data] = (acc[data] || 0) + item.valorVenda;
        return acc;
    }, {});

    const datasOrdenadas = Object.keys(vendasPorData).sort((a, b) => 
        new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-'))
    );

    const ctxTemporal = document.getElementById('graficoTemporal');
    if (ctxTemporal) {
        new Chart(ctxTemporal, {
            type: 'line',
            data: {
                labels: datasOrdenadas,
                datasets: [{
                    label: 'Vendas (R$)',
                    data: datasOrdenadas.map(data => vendasPorData[data]),
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                });
                            }
                        }
                    }
                }
            }
        });
    }
}

// NOVO: Função para exportar PDF
async function exportarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações do PDF
        const margem = 20;
        const larguraPagina = doc.internal.pageSize.getWidth();
        const alturaPagina = doc.internal.pageSize.getHeight();
        
        // Cabeçalho
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('Sistema de Relatórios', margem, margem + 10);
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        const { dataInicial, dataFinal } = calcularDatas();
        const dataInicialFormatada = new Date(dataInicial).toLocaleDateString('pt-BR');
        const dataFinalFormatada = new Date(dataFinal).toLocaleDateString('pt-BR');
        doc.text(`Período: ${dataInicialFormatada} a ${dataFinalFormatada}`, margem, margem + 25);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margem, margem + 35);
        
        // Linha separadora
        doc.setLineWidth(0.5);
        doc.line(margem, margem + 40, larguraPagina - margem, margem + 40);
        
        // Tentar capturar o conteúdo da tabela
        const tabelaElement = document.querySelector('#conteudoRelatorio table');
        if (tabelaElement) {
            // Usar html2canvas se disponível, senão fazer uma versão simplificada
            if (window.html2canvas) {
                const canvas = await html2canvas(tabelaElement);
                const imgData = canvas.toDataURL('image/png');
                
                const imgWidth = larguraPagina - (2 * margem);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                doc.addImage(imgData, 'PNG', margem, margem + 50, imgWidth, imgHeight);
            } else {
                // Versão simplificada sem html2canvas
                doc.setFontSize(10);
                let yPos = margem + 60;
                
                doc.text('Dados do Relatório:', margem, yPos);
                yPos += 15;
                
                // Extrair dados da tabela
                const linhas = tabelaElement.querySelectorAll('tbody tr');
                linhas.forEach((linha, index) => {
                    if (yPos > alturaPagina - 30) {
                        doc.addPage();
                        yPos = margem + 20;
                    }
                    
                    const colunas = linha.querySelectorAll('td');
                    if (colunas.length >= 4) {
                        const texto = `${index + 1}. ${colunas[1].textContent.trim()} - ${colunas[4].textContent.trim()}`;
                        doc.text(texto, margem, yPos);
                        yPos += 8;
                    }
                });
            }
        } else {
            // Se não houver tabela, adicionar texto do conteúdo
            doc.setFontSize(12);
            doc.text('Conteúdo do relatório não encontrado.', margem, margem + 60);
        }
        
        // Rodapé
        const totalPaginas = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPaginas; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Página ${i} de ${totalPaginas}`, larguraPagina - margem - 30, alturaPagina - 10);
        }
        
        // Salvar o PDF
        const nomeArquivo = `relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nomeArquivo);
        
        // Feedback visual
        mostrarNotificacao('PDF gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        mostrarNotificacao('Erro ao gerar PDF. Tente novamente.', 'error');
    }
}

// NOVO: Função para mostrar notificações melhorada
function mostrarNotificacao(mensagem, tipo = 'info', duracao = 5000) {
    // Remover notificações existentes do mesmo tipo
    const notificacoesExistentes = document.querySelectorAll('.notification-toast');
    notificacoesExistentes.forEach(notif => {
        if (notif.dataset.tipo === tipo) {
            notif.remove();
        }
    });

    const notificacao = document.createElement('div');
    notificacao.className = `notification-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white max-w-sm transition-all duration-300 transform translate-x-full`;
    notificacao.dataset.tipo = tipo;
    
    const cores = {
        success: 'bg-gradient-to-r from-green-500 to-green-600 border border-green-400',
        error: 'bg-gradient-to-r from-red-500 to-red-600 border border-red-400',
        info: 'bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400',
        warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 border border-yellow-400'
    };
    
    const icones = {
        success: 'check-circle',
        error: 'x-circle',
        info: 'info',
        warning: 'alert-triangle'
    };
    
    notificacao.classList.add(...cores[tipo].split(' '));
    notificacao.innerHTML = `
        <div class="flex items-start space-x-3">
            <i data-lucide="${icones[tipo]}" class="w-5 h-5 mt-0.5 flex-shrink-0"></i>
            <div class="flex-1">
                <p class="text-sm font-medium">${mensagem}</p>
            </div>
            <button onclick="removerNotificacao(this.parentElement.parentElement)" class="flex-shrink-0 text-white hover:text-gray-200 transition-colors">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notificacao);
    
    // Criar ícones do Lucide
    lucide.createIcons();
    
    // Animar entrada
    setTimeout(() => {
        notificacao.classList.remove('translate-x-full');
        notificacao.classList.add('translate-x-0');
    }, 100);
    
    // Auto-remover após o tempo especificado
    setTimeout(() => {
        removerNotificacao(notificacao);
    }, duracao);
}

// Função para remover notificação
function removerNotificacao(elemento) {
    if (!elemento) return;
    
    elemento.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
        if (elemento.parentNode) {
            elemento.parentNode.removeChild(elemento);
        }
    }, 300);
}

// Adicionar estilos CSS dinamicamente para as notificações
const estilosNotificacao = document.createElement('style');
estilosNotificacao.textContent = `
    .notification-toast {
        backdrop-filter: blur(8px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    
    .notification-toast:hover {
        transform: translateX(-5px) scale(1.02);
    }
    
    @media (max-width: 640px) {
        .notification-toast {
            left: 1rem;
            right: 1rem;
            max-width: none;
            transform: translateY(-100%);
        }
        
        .notification-toast.translate-x-0 {
            transform: translateY(0);
        }
        
        .notification-toast.translate-x-full {
            transform: translateY(-100%);
        }
    }
`;
document.head.appendChild(estilosNotificacao);