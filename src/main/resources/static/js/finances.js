$(document).ready(function () {
    console.log("FINANCES.JS aberto!");
    const moedaBRL = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    let todosRegistros = [];
    let periodoSelecionado = 'todos';
    let termoBusca = '';

    function toggleViews() {
        $('#viewFinances').toggleClass('d-none');
        $('#viewNewRecord').toggleClass('d-none');
    }

    function formatarData(data) {
        if (!data) {
            return '-';
        }

        // Evita problemas de fuso horário ao exibir LocalDate.
        const partes = data.split('-');

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function mostrarMensagemTabela(mensagem) {
        const linha = $('<tr>');
        const celula = $('<td>')
            .attr('colspan', 6)
            .addClass('text-center text-muted py-4')
            .text(mensagem);

        $('#tabelaRegistros').empty().append(
            linha.append(celula)
        );
    }

    function renderizarRegistros(registros) {
        const tbody = $('#tabelaRegistros');
        tbody.empty();

        if (!registros || registros.length === 0) {
            mostrarMensagemTabela(
                'Nenhum registro financeiro cadastrado.'
            );
            return;
        }

        registros.forEach(function (registro) {
            const entrada = registro.tipo === 'ENTRADA';

            const linha = $('<tr>');

            // Data
            linha.append(
                $('<td>')
                    .addClass('ps-4 text-muted')
                    .text(formatarData(registro.data))
            );

            // Descrição
            linha.append(
                $('<td>')
                    .addClass('fw-semibold')
                    .text(registro.descricao)
            );

            // Categoria
            const badgeCategoria = $('<span>')
                .addClass('badge bg-light text-dark border')
                .text(registro.categoria);

            linha.append(
                $('<td>').append(badgeCategoria)
            );

            // Tipo
            const badgeTipo = $('<span>')
                .addClass(
                    entrada
                        ? 'badge bg-success-subtle text-success fw-bold'
                        : 'badge bg-danger-subtle text-danger fw-bold'
                )
                .text(entrada ? 'Entrada' : 'Saída');

            linha.append(
                $('<td>').append(badgeTipo)
            );

            // Valor
            const valorNumerico = Number(registro.valor);

            const valorFormatado = Number.isFinite(valorNumerico)
                ? moedaBRL.format(valorNumerico)
                : '-';

            const valorExibido = entrada
                ? valorFormatado
                : `-${valorFormatado}`;

            linha.append(
                $('<td>')
                    .addClass(
                        entrada
                            ? 'text-success fw-bold'
                            : 'text-danger fw-bold'
                    )
                    .text(valorExibido)
            );

            // Ações: serão implementadas na próxima etapa.
            const botaoEditar = $('<button>')
                .attr('type', 'button')
                .attr('title', 'Editar — em breve')
                .prop('disabled', true)
                .addClass(
                    'btn btn-sm btn-link text-muted p-0 me-2'
                )
                .append(
                    $('<i>').addClass('bi bi-pencil-square')
                );

            const botaoExcluir = $('<button>')
                .attr('type', 'button')
                .attr('title', 'Excluir — em breve')
                .prop('disabled', true)
                .addClass(
                    'btn btn-sm btn-link text-muted p-0'
                )
                .append(
                    $('<i>').addClass('bi bi-trash')
                );

            const celulaAcoes = $('<td>')
                .addClass('text-end pe-4')
                .append(botaoEditar, botaoExcluir);

            linha.append(celulaAcoes);
            tbody.append(linha);
        });
    }

    function aplicarFiltros() {
        const hoje = new Date();

        const hojeISO = [
            hoje.getFullYear(),
            String(hoje.getMonth() + 1).padStart(2, '0'),
            String(hoje.getDate()).padStart(2, '0')
        ].join('-');

        let registrosFiltrados = todosRegistros;

        // Filtro de período
        if (periodoSelecionado === 'mes') {
            const inicio = new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                hoje.getDate() - 29
            );

            const inicioISO = [
                inicio.getFullYear(),
                String(inicio.getMonth() + 1).padStart(2, '0'),
                String(inicio.getDate()).padStart(2, '0')
            ].join('-');

            registrosFiltrados = registrosFiltrados.filter(function (registro) {
                return registro.data >= inicioISO &&
                    registro.data <= hojeISO;
            });
        }

        if (periodoSelecionado === 'ano') {
            const inicioAno = `${hoje.getFullYear()}-01-01`;

            registrosFiltrados = registrosFiltrados.filter(function (registro) {
                return registro.data >= inicioAno &&
                    registro.data <= hojeISO;
            });
        }

        // Busca por descrição ou categoria
        if (termoBusca.trim() !== '') {
            const termo = termoBusca.trim().toLocaleLowerCase();

            registrosFiltrados = registrosFiltrados.filter(function (registro) {
                const descricao = (registro.descricao || '').toLocaleLowerCase();
                const categoria = (registro.categoria || '').toLocaleLowerCase();

                return descricao.includes(termo) ||
                    categoria.includes(termo);
            });
        }

        renderizarRegistros(registrosFiltrados);
    }

    // Selecionar período
    $('#filtroPeriodo .dropdown-item').on('click', function (e) {
        e.preventDefault();

        periodoSelecionado = $(this).data('periodo');

        // Atualiza o texto do botão
        $('#btnFiltroPeriodo').text($(this).text().trim());

        // Atualiza a opção ativa no dropdown
        $('#filtroPeriodo .dropdown-item').removeClass('active');
        $(this).addClass('active');

        aplicarFiltros();
    });

    // Pesquisar enquanto o usuário digita
    $('#buscaRegistros').on('input', function () {
        termoBusca = $(this).val();
        aplicarFiltros();
    });

    function carregarRegistros() {
        mostrarMensagemTabela('Carregando registros...');

        $.ajax({
            url: '/api/registros-financeiros',
            method: 'GET',
            dataType: 'json'

        }).done(function (registros) {
            todosRegistros = registros;
            aplicarFiltros();

        }).fail(function (xhr) {
            console.log("Falhei ao renderizar os registros");
            if (xhr.status === 401) {
                window.location.replace('/login');
                return;
            }

            mostrarMensagemTabela(
                'Não foi possível carregar os registros.'
            );

            console.error(
                'Erro ao carregar registros:',
                xhr.status,
                xhr.responseText
            );
        });
    }

    // Abrir formulário
    $('#btnOpenNewRecord').on('click', function () {
        toggleViews();
    });

    // Cancelar formulário
    $('#btnCancelRecord').on('click', function () {
        $('#formNewRecord')[0].reset();
        toggleViews();
    });

    // Cadastrar registro
    $('#formNewRecord').on('submit', function (e) {
        e.preventDefault();

        const formElement = this;

        const registro = {
            tipo: $('input[name="tipo"]:checked').val(),
            valor: $('#recordAmount').val(),
            data: $('#recordDate').val(),

            // O seletor precisa corresponder exatamente ao ID do HTML.
            categoria: $('#recordCathegory').val(),

            descricao: $('#recordDescription').val()
        };

        console.log('Registro enviado:', registro);

        $.ajax({
            url: '/api/registros-financeiros',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(registro)

        }).done(function (resposta) {

            alert(resposta.mensagem);

            formElement.reset();
            toggleViews();

            // Atualiza a tabela com os dados reais do banco.
            carregarRegistros();

        }).fail(function (xhr) {

            const mensagem =
                xhr.responseJSON?.erro
                || 'Não foi possível salvar o registro financeiro.';

            alert(mensagem);

            if (xhr.status === 401) {
                window.location.replace('/login');
            }
        });
    });

    // Carrega os registros ao abrir a página.
    carregarRegistros();

});