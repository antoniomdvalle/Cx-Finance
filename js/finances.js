$(document).ready(function(){
    function toggleViews(){
        $('#viewFinances').toggleClass('d-none');
        $('#viewNewRecord').toggleClass('d-none');
    }

    // new record option
    $('#btnOpenNewRecord').on('click', function(){
        toggleViews();
    });

    // cancel form
    $('#btnCancelRecord').on('click', function(){
        $('#formNewRecord')[0].reset();
        toggleViews();
    });

    // submit
    $('#formNewRecord').on('submit', function(e) {
        e.preventDefault();

        this.reset();
        toggleViews();
    })

});