$(document).ready(function(){
 

    $('.modifybtn').click(function(){

        $(this).css('display','none');
        $('.password-table').css('display','block');
    });


    $('#edit-user').click(function(){
        $('#txtuser').removeAttr('readonly');
        $('#canceluser').css('display','inline');
        $('#udisplay').css('display','inline');
        $(this).css('display','none');
    });

    $('#edit-email').click(function(){
        $('#txtemail').removeAttr('readonly');
        $('#cancelemail').css('display','inline');
        $('#edisplay').css('display','inline');
        $(this).css('display','none');
    });

    $('#canceluser').click(function(){
        window.location.href="/home";
    });

    $('#cancelemail').click(function(){
        window.location.href="/home";
    });

    $('#cancelpass').click(function(){
        window.location.href="/home";
    });

    $('#cancelcate').click(function(){
        window.location.href="/home";
    });

    $('#canceldet').click(function(){
        window.location.href="/home";
    });



});