$(document).ready(function() {
    var socket = io.connect();

    var name = getCookie("name");
    var room = getCookie("room");

    socket.on('connect', function() {
        socket.emit('addUser', name, room);
        // socket.emit('switchRoom', room);
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

            console.log("Usuario " + usernames[user]);
        }
    });

    socket.on('listWords', function(words){
        $('.board-box').empty();
        console.log(words);
        // for (word in words){
        //     $('.board-box').append("<div class='word'>" + words[word]+ "</div>");
        //     console.log(word);
        // }
        for (var i = 0; i < words.length; i++) {
            $('.board-box').append("<div class='word'>" +
            "<p>" + words[i].palabra + "</p>" +
            "</div>");
        }
        console.log(typeof words);
    });
});
