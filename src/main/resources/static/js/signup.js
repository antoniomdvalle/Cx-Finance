const nameInput = $('#txtName');
const emailInput = $('#txtEmail');
const passwordInput = $('#txtPassword');
const passwordInputCheck = $('#txtPasswordCheck');
const termsCheckbox = $('#chkTerms');
const submitBtn = $('#btnSubmit');
const signupForm = $('#signupForm');

function validatePasswords() {
    const password = passwordInput.val();
    const passwordCheck = passwordInputCheck.val();
    const termsAccepted = termsCheckbox.is(':checked');

    // Validações
    const validPasswords = password.length >= 6 && password === passwordCheck;

    if (validPasswords && termsAccepted) {
        submitBtn.prop('disabled', false);
    } else {
        submitBtn.prop('disabled', true);
    }
    
    if (passwordCheck.length > 0) {
        if (validPasswords) {
            passwordInputCheck.removeClass('is-invalid');
            passwordInputCheck.addClass('is-valid');      
        } else {
            passwordInputCheck.addClass('is-invalid');
            passwordInputCheck.removeClass('is-valid');
        }
    } else {
        passwordInputCheck.removeClass('is-invalid is-valid');
    }
}

// Eventos de escuta para validação em tempo real com jQuery
passwordInput.on('input', validatePasswords);
passwordInputCheck.on('input', validatePasswords);
termsCheckbox.on('change', validatePasswords);

// Intercepta o envio do formulário para enviar via AJAX usando jQuery
signupForm.on('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão da página

    const userData = {
        name: nameInput.val(),
        email: emailInput.val(),
        password: passwordInput.val()
    };

    $.ajax({
        url: '/api/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function(response) {
            // Sucesso! Redireciona para a tela de login
            window.location.href = '/login';
        },
        error: function(xhr) {
            // Se houver erro (ex: e-mail já existente), exibe a mensagem retornada pelo back-end
            const errorMessage = xhr.responseText || 'Erro ao realizar o cadastro.';
            alert(errorMessage);
        }
    });
});