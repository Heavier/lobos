$(function() {
    var socket = io.connect();

    socket.on('connect', function(){
        socket.emit('addUser', getCookie("name"));
    });

    socket.on('updateChat', function(username, data){
        $(".chat-history").append('<div class="msg-user"><div>' + username +
        "</div><div>" + data + "</div></div>");
    });

    $(function(){
        $("#sendMsg").click(function(){
            var message = $('#msgContent').val();
            $('#data').val('');
            socket.emit('sendChat', message);
        });
    })

});
