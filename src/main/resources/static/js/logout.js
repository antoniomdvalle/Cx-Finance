$(document).ready(function() {
    $('#btnLogout').on('click', function() {
        $.post('/api/logout', function() {
            // Destrói o histórico e redireciona para o login (impedindo o botão "voltar")
            window.location.replace('/login');
        }).fail(function() {
            alert('Erro ao realizar logout.');
        });
    });
});