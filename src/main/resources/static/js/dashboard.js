$(document).ready(function () {

    console.log("Dashboard.js carregado!");

    $("#btnLogout").on("click", function () {

        console.log("Botão de logout clicado!");

        $.post("/api/logout")
            .done(function () {
                window.location.replace("/login");
            })
            .fail(function (erro) {
                console.error("Erro ao fazer logout:", erro);
                alert("Não foi possível encerrar a sessão.");
            });

    });

});