
$(document).ready(function () {

    const $listaMetas = $("#listaMetas");
    const $carregando = $("#carregandoMetas");
    const $metasVazias = $("#metasVazias");
    const $mensagem = $("#mensagemMetas");

    const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    function formatarMoeda(valor) {
        return formatadorMoeda.format(Number(valor));
    }

    function formatarData(data) {
        if (!data) {
            return "No deadline";
        }

        // A API envia LocalDate no formato yyyy-MM-dd.
        const partes = data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function calcularProgresso(meta) {
        const objetivo = Number(meta.valorObjetivo);
        const guardado = Number(meta.valorGuardado);

        if (
            !Number.isFinite(objetivo) ||
            !Number.isFinite(guardado) ||
            objetivo <= 0 ||
            guardado < 0
        ) {
            return 0;
        }

        return Math.min(
            100,
            Math.round((guardado / objetivo) * 100)
        );
    }

    function criarCard(meta) {
        const progresso = Number.isFinite(Number(meta.progresso))
            ? Math.max(0, Math.min(100, Number(meta.progresso)))
            : calcularProgresso(meta);

        const $card = $("<article>")
            .addClass("card border-0 shadow-sm p-3");

        const $corpo = $("<div>")
            .addClass("d-flex flex-column flex-lg-row gap-3 align-items-lg-center");

        // Ícone e informações principais
        const $identificacao = $("<div>")
            .addClass("d-flex align-items-center gap-3")
            .css("min-width", "220px");

        const $icone = $("<div>")
            .addClass(
                "bg-primary-subtle text-primary rounded-circle " +
                "d-flex align-items-center justify-content-center flex-shrink-0"
            )
            .css({
                width: "48px",
                height: "48px"
            });

        $("<i>")
            .addClass("bi bi-bullseye fs-4")
            .appendTo($icone);

        const $informacoes = $("<div>").addClass("min-w-0");

        $("<h6>")
            .addClass("fw-bold mb-1 text-dark text-break")
            .text(meta.nomeMeta || "Untitled goal")
            .appendTo($informacoes);

        $("<small>")
            .addClass("text-muted")
            .text("Deadline: " + formatarData(meta.prazo))
            .appendTo($informacoes);

        $identificacao.append($icone, $informacoes);

        // Valores e progresso
        const $areaProgresso = $("<div>")
            .addClass("flex-grow-1")
            .css("min-width", "0");

        const $valores = $("<div>")
            .addClass(
                "d-flex flex-wrap justify-content-between gap-1 " +
                "mb-2 small"
            );

        const $textoValores = $("<span>")
            .addClass("text-dark");

        $("<strong>")
            .text(formatarMoeda(meta.valorGuardado))
            .appendTo($textoValores);

        $("<span>")
            .addClass("text-muted")
            .text(" of " + formatarMoeda(meta.valorObjetivo))
            .appendTo($textoValores);

        $("<span>")
            .addClass("fw-bold text-primary")
            .text(progresso + "%")
            .appendTo($valores);

        const $barra = $("<div>")
            .addClass("progress")
            .css("height", "6px")
            .attr("role", "progressbar")
            .attr("aria-label", "Goal progress: " + (meta.nomeMeta || "goal"))
            .attr("aria-valuenow", progresso)
            .attr("aria-valuemin", 0)
            .attr("aria-valuemax", 100);

        $("<div>")
            .addClass("progress-bar bg-primary")
            .css("width", progresso + "%")
            .appendTo($barra);

        $areaProgresso.append($valores, $barra);

        // O gerenciamento será implementado na próxima etapa.
        const $botaoGerenciar = $("<a>")
            .attr("href", "/edit-goal?id=" + encodeURIComponent(meta.id))
            .addClass("btn btn-outline-secondary btn-sm px-3 flex-shrink-0")
            .text("Manage");

        $corpo.append(
            $identificacao,
            $areaProgresso,
            $botaoGerenciar
        );

        $card.append(
            $("<div>").addClass("card-body p-0").append($corpo)
        );

        return $card;
    }

    function mostrarErro(texto) {
        $mensagem
            .removeClass("d-none alert-success alert-warning")
            .addClass("alert-danger")
            .text(texto);
    }

    function carregarMetas() {
        $carregando.removeClass("d-none");
        $metasVazias.addClass("d-none");
        $mensagem.addClass("d-none");
        $listaMetas.empty();

        $.ajax({
            url: "/api/goals",
            method: "GET",
            dataType: "json",

            success: function (metas) {
                if (!Array.isArray(metas)) {
                    mostrarErro("The server returned an unexpected response.");
                    return;
                }

                if (metas.length === 0) {
                    $metasVazias.removeClass("d-none");
                    return;
                }

                metas.forEach(function (meta) {
                    $listaMetas.append(criarCard(meta));
                });
            },

            error: function (xhr) {
                if (xhr.status === 401) {
                    mostrarErro(
                        "Your session has expired. Please sign in again."
                    );
                } else {
                    mostrarErro(
                        "Unable to load your goals. Please try again later."
                    );
                }
            },

            complete: function () {
                $carregando.addClass("d-none");
            }
        });
    }

    carregarMetas();
});
