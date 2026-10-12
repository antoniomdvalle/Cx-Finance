
$(document).ready(function () {

    const $mensagem = $("#mensagemEdicao");
    const $carregando = $("#carregandoMeta");
    const $conteudo = $("#conteudoMeta");
    const $form = $("#formEditarMeta");
    const $btnSalvar = $("#btnSalvarMeta");
    const $btnExcluir = $("#btnExcluirMeta");

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    let requisicaoEmAndamento = false;

    function mostrarMensagem(texto, tipo) {
        $mensagem
            .removeClass("d-none alert-success alert-danger alert-warning")
            .addClass("alert-" + tipo)
            .text(texto);
    }

    function converterMoeda(valor) {
        let texto = String(valor).trim();

        texto = texto.replace(/\s/g, "").replace(/^R\$/i, "");

        if (!/^\d+(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/.test(texto)) {
            return null;
        }

        const numero = Number(
            texto.replace(/\./g, "").replace(",", ".")
        );

        return Number.isFinite(numero) ? numero : null;
    }

    function formatarMoedaParaCampo(valor) {
        return new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(valor));
    }

    function carregarMeta() {
        if (!id || !/^\d+$/.test(id)) {
            $carregando.addClass("d-none");
            mostrarMensagem("Invalid goal identifier.", "danger");
            return;
        }

        $.ajax({
            url: "/api/goals/" + encodeURIComponent(id),
            method: "GET",
            dataType: "json",

            success: function (meta) {
                $("#txtNomeMeta").val(meta.nomeMeta);
                $("#txtValorObjetivo").val(
                    formatarMoedaParaCampo(meta.valorObjetivo)
                );
                $("#txtValorGuardado").val(
                    formatarMoedaParaCampo(meta.valorGuardado)
                );
                $("#txtPrazo").val(meta.prazo);
                $("#txtDescricao").val(meta.descricao || "");

                $conteudo.removeClass("d-none");
            },

            error: function (xhr) {
                if (xhr.status === 401) {
                    mostrarMensagem(
                        "Your session has expired. Please sign in again.",
                        "danger"
                    );
                } else if (xhr.status === 404) {
                    mostrarMensagem(
                        "Goal not found or you do not have permission to access it.",
                        "danger"
                    );
                } else {
                    mostrarMensagem(
                        "Unable to load this goal. Please try again.",
                        "danger"
                    );
                }
            },

            complete: function () {
                $carregando.addClass("d-none");
            }
        });
    }

    $form.on("submit", function (event) {
        event.preventDefault();

        if (requisicaoEmAndamento) {
            return;
        }

        const nomeMeta = $("#txtNomeMeta").val().trim();
        const valorObjetivo = converterMoeda(
            $("#txtValorObjetivo").val()
        );
        const valorGuardado = converterMoeda(
            $("#txtValorGuardado").val()
        );
        const prazo = $("#txtPrazo").val();
        const descricao = $("#txtDescricao").val().trim();

        if (!nomeMeta) {
            mostrarMensagem("Enter the goal name.", "warning");
            return;
        }

        if (valorObjetivo === null || valorObjetivo <= 0) {
            mostrarMensagem(
                "The target amount must be greater than zero.",
                "warning"
            );
            return;
        }

        if (valorGuardado === null || valorGuardado < 0) {
            mostrarMensagem(
                "The saved amount cannot be negative.",
                "warning"
            );
            return;
        }

        if (!prazo) {
            mostrarMensagem("Select a valid deadline.", "warning");
            return;
        }

        const meta = {
            nomeMeta: nomeMeta,
            valorObjetivo: valorObjetivo,
            valorGuardado: valorGuardado,
            prazo: prazo,
            descricao: descricao || null
        };

        requisicaoEmAndamento = true;
        $btnSalvar.prop("disabled", true).text("Saving...");
        $btnExcluir.prop("disabled", true);

        $.ajax({
            url: "/api/goals/" + encodeURIComponent(id),
            method: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(meta),

            success: function () {
                window.location.href = "/goals";
            },

            error: function (xhr) {
                if (xhr.status === 401) {
                    mostrarMensagem(
                        "Your session has expired. Please sign in again.",
                        "danger"
                    );
                } else if (xhr.status === 404) {
                    mostrarMensagem(
                        "Goal not found or you do not have permission to edit it.",
                        "danger"
                    );
                } else if (xhr.status === 400) {
                    mostrarMensagem(
                        "Some information is invalid. Check the fields and try again.",
                        "warning"
                    );
                } else {
                    mostrarMensagem(
                        "Unable to save changes. Please try again.",
                        "danger"
                    );
                }
            },

            complete: function () {
                requisicaoEmAndamento = false;
                $btnSalvar.prop("disabled", false).text("Save changes");
                $btnExcluir.prop("disabled", false);
            }
        });
    });

    $btnExcluir.on("click", function () {
        if (requisicaoEmAndamento) {
            return;
        }

        const confirmar = window.confirm(
            "Are you sure you want to delete this goal? This action cannot be undone."
        );

        if (!confirmar) {
            return;
        }

        requisicaoEmAndamento = true;
        $btnExcluir.prop("disabled", true).text("Deleting...");
        $btnSalvar.prop("disabled", true);

        $.ajax({
            url: "/api/goals/" + encodeURIComponent(id),
            method: "DELETE",

            success: function () {
                window.location.href = "/goals";
            },

            error: function (xhr) {
                if (xhr.status === 401) {
                    mostrarMensagem(
                        "Your session has expired. Please sign in again.",
                        "danger"
                    );
                } else if (xhr.status === 404) {
                    mostrarMensagem(
                        "Goal not found or it has already been deleted.",
                        "warning"
                    );
                } else {
                    mostrarMensagem(
                        "Unable to delete this goal. Please try again.",
                        "danger"
                    );
                }
            },

            complete: function () {
                requisicaoEmAndamento = false;
                $btnExcluir.prop("disabled", false).text("Delete goal");
                $btnSalvar.prop("disabled", false).text("Save changes");
            }
        });
    });

    carregarMeta();
});
