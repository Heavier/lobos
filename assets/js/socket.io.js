$(function() {
    var socket = io();
    $('form').submit(function() {
        socket.emit('login', $('#username').val());
        console.log($('#username').val());
        $('#username').val('');
        return false;
    });

    socket.on('redirect', function(destination){
        window.location.href = destination;
    });
});
