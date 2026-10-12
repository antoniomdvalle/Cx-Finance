$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário HTML

        const loginData = {
            email: $('#txtEmail').val(),
            password: $('#txtPassword').val()
        };

        $.ajax({
            url: '/api/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function(response) {
                // Se o login der certo, o back-end responde OK e redirecionamos via JS
                window.location.href = '/dashboard';
            },
            error: function(xhr) {
                // Se der erro (ex: 401 Unauthorized), exibe a mensagem retornada
                const errorMessage = xhr.responseText || 'E-mail ou senha inválidos.';
                alert(errorMessage);
            }
        });
    });
});