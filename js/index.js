var input = document.getElementById('txtPassword');

input.oninvalid = function(event){
    event.target.setCustomValidity('The password must contain at least 6 digits and one special character (ex: #)')
}