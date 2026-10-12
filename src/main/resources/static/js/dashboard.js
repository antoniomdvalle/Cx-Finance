$(document).ready(function () {

    console.log("Dashboard.js carregado!");

    let graficoFinanceiro = null;

    const formatarMoeda = (valor) => {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    function carregarResumo() {

        $.ajax({
            url: "/api/dashboard",
            method: "GET",
            dataType: "json",

            success: function (resumo) {
                $("#totalReceitas").text(
                    formatarMoeda(resumo.totalReceitas)
                );

                $("#totalDespesas").text(
                    formatarMoeda(resumo.totalDespesas)
                );

                $("#saldoAtual").text(
                    formatarMoeda(resumo.saldoAtual)
                );
            },

            error: function (erro) {
                console.error(
                    "Erro ao carregar o resumo:",
                    erro
                );

                if (erro.status === 401) {
                    window.location.replace("/login");
                    return;
                }

                $("#totalReceitas, #totalDespesas, #saldoAtual")
                    .text("Indisponível");
            }
        });
    }

    function carregarGrafico() {

        $.ajax({
            url: "/api/dashboard/evolucao-mensal",
            method: "GET",
            dataType: "json",

            success: function (dados) {

                const canvas = document.getElementById(
                    "graficoFinanceiro"
                );

                if (!canvas) {
                    return;
                }

                const contexto = canvas.getContext("2d");

                if (graficoFinanceiro) {
                    graficoFinanceiro.destroy();
                }

                $("#mensagemGrafico").addClass("d-none").text("");

                graficoFinanceiro = new Chart(contexto, {
                    type: "bar",

                    data: {
                        labels: dados.map(item => item.mes),

                        datasets: [
                            {
                                label: "Receitas",
                                data: dados.map(
                                    item => Number(item.totalReceitas)
                                ),
                                backgroundColor: "#198754",
                                borderRadius: 5
                            },
                            {
                                label: "Despesas",
                                data: dados.map(
                                    item => Number(item.totalDespesas)
                                ),
                                backgroundColor: "#dc3545",
                                borderRadius: 5
                            }
                        ]
                    },

                    options: {
                        responsive: true,
                        maintainAspectRatio: false,

                        interaction: {
                            intersect: false,
                            mode: "index"
                        },

                        plugins: {
                            legend: {
                                position: "bottom"
                            },

                            tooltip: {
                                callbacks: {
                                    label: function (contexto) {
                                        return contexto.dataset.label
                                            + ": "
                                            + formatarMoeda(
                                                contexto.raw
                                            );
                                    }
                                }
                            }
                        },

                        scales: {
                            y: {
                                beginAtZero: true,

                                ticks: {
                                    callback: function (valor) {
                                        return Number(valor)
                                            .toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                                maximumFractionDigits: 0
                                            });
                                    }
                                }
                            }
                        }
                    }
                });
            },

            error: function (erro) {

                console.error(
                    "Erro ao carregar o gráfico:",
                    erro
                );

                if (erro.status === 401) {
                    window.location.replace("/login");
                    return;
                }

                $("#mensagemGrafico")
                    .removeClass("d-none")
                    .text(
                        "Não foi possível carregar os dados do gráfico."
                    );
            }
        });
    }

    carregarResumo();
    carregarGrafico();
});