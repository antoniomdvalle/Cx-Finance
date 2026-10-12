
$(document).ready(function () {

    let graficoCategorias = null;
    let ultimoRelatorio = null;

    const moeda = valor => Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const dataBR = valor => {
        if (!valor) return "-";

        const partes = valor.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

    function mostrarMensagem(texto, tipo = "danger") {
        $("#mensagemRelatorio")
            .removeClass("d-none alert-danger alert-success alert-warning")
            .addClass(`alert-${tipo}`)
            .text(texto);
    }

    function ocultarMensagem() {
        $("#mensagemRelatorio")
            .addClass("d-none")
            .text("");
    }

    function carregarRelatorio() {

        const dataInicio = $("#dataInicio").val();
        const dataFim = $("#dataFim").val();

        ocultarMensagem();

        if (dataInicio && dataFim && dataInicio > dataFim) {
            mostrarMensagem(
                "A data inicial não pode ser posterior à data final."
            );
            return;
        }

        $("#carregandoRelatorio").removeClass("d-none");
        $("#conteudoRelatorio").addClass("d-none");
        $("#btnFiltrar").prop("disabled", true);

        $.ajax({
            url: "/api/reports",
            method: "GET",
            dataType: "json",
            data: {
                dataInicio: dataInicio || "",
                dataFim: dataFim || "",
                categoria: $("#categoria").val() || ""
            },

            success: function (relatorio) {
                ultimoRelatorio = relatorio;

                atualizarIndicadores(relatorio);
                atualizarCategorias(relatorio.categorias || []);
                atualizarGrafico(relatorio.despesasPorCategoria || {});
                atualizarTabela(relatorio.movimentacoes || []);
                atualizarPeriodo(relatorio);

                $("#conteudoRelatorio").removeClass("d-none");
            },

            error: function (erro) {
                console.error("Erro ao carregar relatório:", erro);

                if (erro.status === 401) {
                    window.location.replace("/login");
                    return;
                }

                const mensagem = erro.responseJSON?.erro
                    || "Não foi possível carregar o relatório.";

                mostrarMensagem(mensagem);
            },

            complete: function () {
                $("#carregandoRelatorio").addClass("d-none");
                $("#btnFiltrar").prop("disabled", false);
            }
        });
    }

    function atualizarIndicadores(relatorio) {
        $("#totalReceitas").text(moeda(relatorio.totalReceitas));
        $("#totalDespesas").text(moeda(relatorio.totalDespesas));
        $("#saldoRelatorio").text(moeda(relatorio.saldo));
        $("#quantidadeMovimentacoes").text(
            relatorio.quantidadeMovimentacoes ?? 0
        );
    }

    function atualizarCategorias(categorias) {

        const categoriaSelecionada = $("#categoria").val();

        $("#categoria").empty();

        $("<option>")
            .val("")
            .text("Todas as categorias")
            .appendTo("#categoria");

        categorias.forEach(categoria => {
            $("<option>")
                .val(categoria)
                .text(categoria)
                .appendTo("#categoria");
        });

        if (categorias.includes(categoriaSelecionada)) {
            $("#categoria").val(categoriaSelecionada);
        }
    }

    function atualizarGrafico(dados) {

        const categorias = Object.keys(dados);
        const valores = Object.values(dados).map(Number);

        if (graficoCategorias) {
            graficoCategorias.destroy();
            graficoCategorias = null;
        }

        if (categorias.length === 0) {
            $("#areaGrafico").addClass("d-none");
            $("#mensagemGrafico")
                .removeClass("d-none")
                .text("Não há despesas para exibir neste filtro.");
            return;
        }

        $("#areaGrafico").removeClass("d-none");
        $("#mensagemGrafico").addClass("d-none");

        graficoCategorias = new Chart(
            document.getElementById("graficoCategorias"),
            {
                type: "doughnut",

                data: {
                    labels: categorias,
                    datasets: [{
                        label: "Despesas",
                        data: valores,
                        backgroundColor: [
                            "#3B82F6",
                            "#198754",
                            "#dc3545",
                            "#ffc107",
                            "#6f42c1",
                            "#20c997",
                            "#fd7e14",
                            "#6c757d",
                            "#0dcaf0",
                            "#d63384"
                        ],
                        borderWidth: 2,
                        borderColor: "#ffffff"
                    }]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            position: "bottom"
                        },

                        tooltip: {
                            callbacks: {
                                label: function (contexto) {
                                    return `${contexto.label}: ${moeda(contexto.raw)}`;
                                }
                            }
                        }
                    }
                }
            }
        );
    }

    function atualizarTabela(movimentacoes) {

        const $tabela = $("#tabelaMovimentacoes");
        $tabela.empty();

        if (movimentacoes.length === 0) {
            $("<tr>")
                .append(
                    $("<td>")
                        .attr("colspan", 5)
                        .addClass("text-center text-muted py-4")
                        .text("Nenhuma movimentação encontrada.")
                )
                .appendTo($tabela);

            return;
        }

        movimentacoes.forEach(registro => {

            const entrada = String(registro.tipo || "")
                .trim()
                .toUpperCase() === "ENTRADA";

            const $linha = $("<tr>");

            $("<td>")
                .text(dataBR(registro.data))
                .appendTo($linha);

            $("<td>")
                .text(registro.descricao || "-")
                .appendTo($linha);

            $("<td>")
                .text(registro.categoria || "-")
                .appendTo($linha);

            $("<td>")
                .append(
                    $("<span>")
                        .addClass(
                            `badge ${entrada ? "text-bg-success" : "text-bg-danger"}`
                        )
                        .text(entrada ? "Receita" : "Despesa")
                )
                .appendTo($linha);

            $("<td>")
                .addClass("text-end text-nowrap")
                .text(`${entrada ? "+" : "-"} ${moeda(registro.valor)}`)
                .appendTo($linha);

            $tabela.append($linha);
        });
    }

    function atualizarPeriodo(relatorio) {

        const inicio = $("#dataInicio").val();
        const fim = $("#dataFim").val();

        if (inicio && fim) {
            $("#periodoRelatorio").text(
                `${dataBR(inicio)} até ${dataBR(fim)}`
            );
        } else if (inicio) {
            $("#periodoRelatorio").text(
                `A partir de ${dataBR(inicio)}`
            );
        } else if (fim) {
            $("#periodoRelatorio").text(
                `Até ${dataBR(fim)}`
            );
        } else {
            $("#periodoRelatorio").text("Histórico completo");
        }
    }

    $("#formFiltros").on("submit", function (evento) {
        evento.preventDefault();
        carregarRelatorio();
    });

    $("#btnLimparFiltros").on("click", function () {
        $("#dataInicio").val("");
        $("#dataFim").val("");
        $("#categoria").val("");

        carregarRelatorio();
    });

    $("#btnImprimir").on("click", function () {
        window.print();
    });

    $("#btnExportarCSV").on("click", function () {

        if (!ultimoRelatorio) {
            mostrarMensagem("Carregue um relatório antes de exportar.");
            return;
        }

        const linhas = [
            ["Data", "Descrição", "Categoria", "Tipo", "Valor"]
        ];

        (ultimoRelatorio.movimentacoes || []).forEach(registro => {
            linhas.push([
                dataBR(registro.data),
                registro.descricao,
                registro.categoria,
                registro.tipo,
                Number(registro.valor).toFixed(2).replace(".", ",")
            ]);
        });

        const escaparCSV = valor =>
            `"${String(valor ?? "").replace(/"/g, '""')}"`;

        const csv = "\uFEFF" + linhas
            .map(linha => linha.map(escaparCSV).join(";"))
            .join("\r\n");

        const arquivo = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(arquivo);
        const link = document.createElement("a");

        link.href = url;
        link.download = "relatorio-financeiro.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    });

    carregarRelatorio();
});
