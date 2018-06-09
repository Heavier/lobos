$(document).ready(function() {
    var socket = io.connect();

    var name = getCookie("name");
    var room = getCookie("room");

    socket.on('connect', function() {
        socket.emit('addUser', name, room);
    });

    socket.on('updateChat', function(username, data) {
        if (username == name) {
            $(".chat-history").append('<div class="my-msg"><div>' + username +
                "</div><div>" + data + "</div></div>");
        } else if(username == "SERVER") {
            $(".chat-history").append('<div class="server-msg"><div>Narrador</div><div>'
            + data + '</div></div>');
        } else {
            $(".chat-history").append('<div class="msg"><div>' + username +
                "</div><div>" + data + "</div></div>");
        }

        $('.chat-history').animate({
               scrollTop: $('.chat-history')[0].scrollHeight}, "fast");
    });


    $("#sendMsg").click(function() {
        var message = $('#msgContent').val();
        $('#msgContent').val('');
        socket.emit('sendChat', message);
    });

    $('#msgContent').focus();

    $('#msgContent').keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#sendMsg").trigger("click");
        }
    });

    $("#imReady").click(function() {
        socket.emit('imReady', name, room);
        $(this).text("PASAR");
        $(this).attr("id", "nextTurn");
        $(this).unbind( "click" );
    });


    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    socket.on('listUsers', function(usernames){
        $('.player-box').empty();
        for (user in usernames){
            if (usernames[user].indexOf("#A#") !== -1){
                $('.player-box').append("<div class='player-name teamA'>" + user + "</div>");
            }else if(usernames[user].indexOf("#B#") !== -1){
                $('.player-box').append("<div class='player-name teamB'>" + user + "</div>");
            }else{
                $('.player-box').append("<div class='player-name'>" + user + "</div>");
            }

        }
    });


    socket.on('listWords', function(words, auxusers){
        $('.board-box').empty();
        /*
            Lista de palabras del usuario si es jefe.
        */
        var correctWords = [{a: 'a'}];
        for (user in auxusers) {
            if (user == name && auxusers[user].indexOf("#J") !== -1) {
                var a = auxusers[user].indexOf("@");
                var b = auxusers[user].lastIndexOf("@");
                var res = auxusers[user].substring(a, b);
                correctWords = res.split("@");
            }
        }

        for (var i = 0; i < words.length; i++) {
            /*
                Comprueba si es una palabra normal o es de las correctas.
            */
            if (correctWords.indexOf(words[i].palabra) !== -1){
                $('.board-box').append("<button type='button' class='word this-one'>" +
                "<p>" + words[i].palabra + "</p>" +
                "</button>");
            }else{
                $('.board-box').append("<button type='button' class='word'>" +
                "<p>" + words[i].palabra + "</p>" +
                "</button>");
            }
        }

        $(".word.this-one").click(function(){
            console.log("click");
            var word = $(this).find("p").text();
            socket.emit('checkCorrect', name, room, word);
        });
    });


});
