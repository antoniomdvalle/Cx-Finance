const passwordInput = document.getElementById('txtPassword');
const passwordInputCheck = document.getElementById('txtPasswordCheck');
const termsCheckbox = document.getElementById('chkTerms');
const submitBtn = document.getElementById('btnSubmit');

function validatePasswords(){
    const password = passwordInput.value;
    const passwordCheck = passwordInputCheck.value;
    const termsAccepted = termsCheckbox.checked;

    // validations
    const validPasswords = password.length >= 6 && password === passwordCheck;

    if(validPasswords && termsAccepted){
        submitBtn.disabled = false;
    }else{
        submitBtn.disabled = true;
    }



    if(passwordCheck.length > 0){
        if(validPasswords){
            passwordInputCheck.classList.remove('is-invalid');
            passwordInputCheck.classList.add('is-valid');      
        }else{
            passwordInputCheck.classList.add('is-invalid');
            passwordInputCheck.classList.remove('is-valid');
        }
    }else{
        passwordInputCheck.classList.remove('is-invalid', 'is-valid');
    }
    }


passwordInput.addEventListener('input', validatePasswords);
passwordInputCheck.addEventListener('input', validatePasswords);

termsCheckbox.addEventListener('change', validatePasswords);
