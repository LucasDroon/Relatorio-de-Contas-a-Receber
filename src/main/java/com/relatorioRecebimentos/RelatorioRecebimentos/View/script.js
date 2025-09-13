document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setupEventListeners();
});

// AJUSTE: URL da API centralizada para fácil manutenção
const API_BASE_URL = 'http://localhost:8080';

function setupEventListeners() {
    // Mapeamento de elementos para evitar repetição
    const periodoFilter = document.getElementById('periodoFilter');
    const customDateRange = document.getElementById('customDateRange');
    const gerarRelatorioBtn = document.getElementById('gerarRelatorio');
    const novoRelatorioBtn = document.getElementById('novoRelatorio');
    const areaRelatorio = document.getElementById('areaRelatorio');

    periodoFilter.addEventListener('change', () => {
        customDateRange.classList.toggle('hidden', periodoFilter.value !== 'custom');
    });

    gerarRelatorioBtn.addEventListener('click', gerarRelatorio);

    novoRelatorioBtn.addEventListener('click', () => {
        areaRelatorio.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Em script.js

async function gerarRelatorio() {
    const loading = document.getElementById('loading');
    const areaRelatorio = document.getElementById('areaRelatorio');

    loading.classList.remove('hidden');
    areaRelatorio.classList.add('hidden');

    if (document.getElementById('periodoFilter').value === 'custom' &&
       (!document.getElementById('dataInicial').value || !document.getElementById('dataFinal').value)) {
        alert('Por favor, selecione as datas inicial e final para o período personalizado.');
        loading.classList.add('hidden');
        return;
    }

    try {
        const params = new URLSearchParams();
        const { dataInicial, dataFinal } = calcularDatas();
        params.append('dataInicial', dataInicial);
        params.append('dataFinal', dataFinal);

        const formaPagamento = document.getElementById('formaPagamentoFilter').value;
        if (formaPagamento && formaPagamento !== 'all') {
            params.append('formaPagamento', formaPagamento);
        }

        const tipoPlano = document.getElementById('tipoPlanoFilter').value;
        if (tipoPlano && tipoPlano !== 'all') {
            params.append('tipoPlano', tipoPlano);
        }

        // AJUSTE FINAL: A URL agora corresponde exatamente ao seu controller
        const apiUrl = `http://localhost:8080/item-venda/relatorio?${params.toString()}`;
        console.log("Chamando API:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const dados = await response.json();
        renderizarTabela(dados);

    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        const container = document.getElementById('conteudoRelatorio');
        container.innerHTML = `<p class="text-red-500 text-center"><strong>Erro ao gerar relatório.</strong><br>${error.message}<br>Verifique se o backend está rodando e o CORS está configurado.</p>`;
        areaRelatorio.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
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
        // AJUSTE: Adicionado o caso para "Último ano"
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
        dataFinal: `${formatar(new Date())}T23:59:59` // Usa a data de hoje como final para períodos fixos
    };
}

function renderizarTabela(dados) {
    const container = document.getElementById('conteudoRelatorio');
    const areaRelatorio = document.getElementById('areaRelatorio');

    if (!dados || dados.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-500 py-8">Nenhum resultado encontrado.</p>`;
        areaRelatorio.classList.remove('hidden');
        return;
    }

    const formatarData = (dataString) => new Date(dataString).toLocaleString('pt-BR');
    const formatarMoeda = (valor) => (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // AJUSTE: Cálculo dos totais
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

    // AJUSTE: Adicionado rodapé com os totais
    const rodape = `
        <tfoot class="bg-gray-200 font-bold">
            <tr>
                <td class="p-3" colspan="4">Total de Registros: ${totalRegistros}</td>
                <td class="p-3 text-right">${formatarMoeda(valorTotal)}</td>
            </tr>
        </tfoot>
    `;

    container.innerHTML = `
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
    `;

    areaRelatorio.classList.remove('hidden');
    areaRelatorio.scrollIntoView({ behavior: 'smooth' });
}