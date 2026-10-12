
$(document).ready(function () {

    const $form = $("#formNovaMeta");
    const $mensagem = $("#mensagemMeta");
    const $botaoEnviar = $form.find('button[type="submit"]');

    function mostrarMensagem(texto, tipo) {
        $mensagem
            .removeClass("d-none alert-success alert-danger alert-warning")
            .addClass("alert-" + tipo)
            .text(texto);
    }

    function converterMoeda(valor) {
        let texto = String(valor).trim();

        // Aceita valores no padrão brasileiro, como 1.500,50.
        texto = texto.replace(/\s/g, "").replace(/^R\$/i, "");

        if (!/^\d+(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/.test(texto)) {
            return null;
        }

        texto = texto.replace(/\./g, "").replace(",", ".");

        const numero = Number(texto);

        return Number.isFinite(numero) ? numero : null;
    }

    function converterData(data) {
        const partes = data.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

        if (!partes) {
            return null;
        }

        const dia = Number(partes[1]);
        const mes = Number(partes[2]);
        const ano = Number(partes[3]);

        const dataValidada = new Date(ano, mes - 1, dia);

        if (
            dataValidada.getFullYear() !== ano ||
            dataValidada.getMonth() !== mes - 1 ||
            dataValidada.getDate() !== dia
        ) {
            return null;
        }

        return `${partes[3]}-${partes[2]}-${partes[1]}`;
    }

    $form.on("submit", function (event) {
        event.preventDefault();

        $mensagem.addClass("d-none");

        const nomeMeta = $("#txtNomeMeta").val().trim();
        const valorObjetivo = converterMoeda($("#txtValorObjetivo").val());
        const valorGuardado = converterMoeda($("#txtValorGuardado").val());
        const prazo = converterData($("#txtPrazo").val());
        const descricao = $("#txtDescricao").val().trim();

        if (!nomeMeta) {
            mostrarMensagem("Informe o nome da meta.", "warning");
            return;
        }

        if (valorObjetivo === null || valorObjetivo <= 0) {
            mostrarMensagem(
                "Informe um valor objetivo válido, maior que zero. Exemplo: 5.000,00.",
                "warning"
            );
            return;
        }

        if (valorGuardado === null || valorGuardado < 0) {
            mostrarMensagem(
                "Informe um valor guardado válido. Ele não pode ser negativo.",
                "warning"
            );
            return;
        }

        if (!prazo) {
            mostrarMensagem(
                "Informe uma data válida no formato dd/mm/aaaa.",
                "warning"
            );
            return;
        }

        const meta = {
            nomeMeta: nomeMeta,
            valorObjetivo: valorObjetivo,
            valorGuardado: valorGuardado,
            prazo: prazo,
            descricao: descricao || null
        };

        $botaoEnviar.prop("disabled", true).text("Criando...");

        $.ajax({
            url: "/api/goals",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(meta),

            success: function (resposta) {
                mostrarMensagem("Meta criada com sucesso!", "success");

                // Ajuste caso a rota de listagem seja diferente.
                window.location.href = "/goals";
            },

            error: function (xhr) {
                if (xhr.status === 401) {
                    mostrarMensagem(
                        "Sua sessão expirou. Entre novamente para continuar.",
                        "danger"
                    );
                } else if (xhr.status === 400) {
                    mostrarMensagem(
                        "Os dados enviados são inválidos. Confira os campos e tente novamente.",
                        "danger"
                    );
                } else {
                    mostrarMensagem(
                        "Não foi possível criar a meta. Tente novamente.",
                        "danger"
                    );
                }
            },

            complete: function () {
                $botaoEnviar.prop("disabled", false).text("Criar meta");
            }
        });
    });
});
