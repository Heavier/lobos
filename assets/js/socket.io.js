$(document).ready(function() {
    var socket = io.connect();

    var name = getCookie("name");
    var room = getCookie("room");
    var nextTeam = "B";

    socket.on('connect', function() {
        socket.emit('addUser', name, room);
    });

    socket.on('updateChat', function(username, data) {
        if (username == name) {
            $(".chat-history").append('<div class="my-msg"><div>' + username +
                "</div><div>" + data + "</div></div>");
        } else if (username == "SERVER") {
            $(".chat-history").append('<div class="server-msg"><div>Narrador</div><div>' +
                data + '</div></div>');
        } else {
            $(".chat-history").append('<div class="msg"><div>' + username +
                "</div><div>" + data + "</div></div>");
        }

        $('.chat-history').animate({
            scrollTop: $('.chat-history')[0].scrollHeight
        }, "fast");
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
        $(this).unbind("click");
        $(this).click(function(){
            socket.emit('rotateTurn', name, room, nextTeam);
        });
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


    socket.on('listUsers', function(usernames) {
        $('.player-box').empty();
        for (user in usernames) {
            if (usernames[user].indexOf("#A#") !== -1) {
                $('.player-box').append("<div class='player-name teamA'>" + user + "</div>");
            } else if (usernames[user].indexOf("#B#") !== -1) {
                $('.player-box').append("<div class='player-name teamB'>" + user + "</div>");
            } else {
                $('.player-box').append("<div class='player-name'>" + user + "</div>");
            }

        }
    });


    var localAuxusers = null;
    socket.on('listWords', function(words, auxusers) {
        localAuxusers = auxusers;
        $('.board-box').empty();
        /*
            Lista de palabras del usuario si es jefe.
        */
        var correctWordsA = [{
            a: 'a'
        }];
        var correctWordsB = [{
            b: 'b'
        }];
        for (user in auxusers) {
            if (user == name && auxusers[user].indexOf("#J") !== -1) {
                for (user in auxusers) {
                    if (auxusers[user].indexOf("#JA#") !== -1) {
                        var a = auxusers[user].indexOf("@");
                        var b = auxusers[user].lastIndexOf("@");
                        var res = auxusers[user].substring(a, b);
                        correctWordsA = res.split("@");
                    }
                    if (auxusers[user].indexOf("#JB#") !== -1) {
                        var a = auxusers[user].indexOf("@");
                        var b = auxusers[user].lastIndexOf("@");
                        var res = auxusers[user].substring(a, b);
                        correctWordsB = res.split("@");
                    }
                }
            }
        }

        for (var i = 0; i < words.length; i++) {
            /*
                Comprueba si es una palabra normal o es de las correctas.
            */
            if (correctWordsA.indexOf(words[i].palabra) !== -1) {
                $('.board-box').append("<button type='button' id=" + words[i].palabra + " class='word this-oneA'>" +
                    "<p>" + words[i].palabra + "</p>" +
                    "</button>");
            }else if(correctWordsB.indexOf(words[i].palabra) !== -1){
                $('.board-box').append("<button type='button' id=" + words[i].palabra + " class='word this-oneB'>" +
                    "<p>" + words[i].palabra + "</p>" +
                    "</button>");
            } else {
                $('.board-box').append("<button type='button' id=" + words[i].palabra + " class='word'>" +
                    "<p>" + words[i].palabra + "</p>" +
                    "</button>");
            }
        }

        $(".word").click(function() {
            console.log("click");
            var word = $(this).find("p").text();
            socket.emit('checkCorrect', name, room, word);
        });

        changeTurn(nextTeam, auxusers);
    });

    socket.on('newPoints', function(team, newpoints) {
        if (team == "A") {
            var oldpoints = $(".points-box .teamA h2").text();
            $(".points-box .teamA h2").remove();
            $(".points-box .teamA").append("<h2>" + oldpoints + "</h2>").delay(300).queue(function(next) {
                $(this).find("h2").text(newpoints);
                next();
            });
        } else {
            var oldpoints = $(".points-box .teamB h2").text();
            $(".points-box .teamB h2").remove();
            $(".points-box .teamB").append("<h2>" + oldpoints + "</h2>").delay(300).queue(function(next) {
                $(this).find("h2").text(newpoints);
                next();
            });
        }
    });

    socket.on('flipCard', function(team, word, correct) {
        if (correct) {
            if (team == "A") {
                $('#' + word).addClass("correctA");
            } else {
                $('#' + word).addClass("correctB");
            }
        } else {
            $('#' + word).addClass("incorrect");
        }
    });

    socket.on('addToPassButton', function(team) {
        // Hacer algo con el boton cada vez que alguien del equipo lo pulsa.
    });

    socket.on('changeTurn', function(currentTeam, auxusers) {
        // Hacer algo con el boton cada vez que alguien del equipo lo pulsa.
        changeTurn(currentTeam, auxusers);
    });

    var crono = null;
    function changeTurn(currentTeam, auxusers){
        startTimer();
        console.log(currentTeam);
        $("#msgContent").fadeTo("slow", 0.4);
        $("#nextTurn").prop("disabled",true);
        $(".word").prop("disabled",true);
        for (user in auxusers) {
            if (user == name && auxusers[user].indexOf("#"+currentTeam+"#") !== -1) {
                console.log("Este usuario es el del equipo que juega");
                console.log(user);
                $(".word").prop("disabled", false);
                $("#nextTurn").prop("disabled", false);
                $("#msgContent").fadeTo("slow", 1);
            }
        }
        if(currentTeam == "A"){
            nextTeam = "B";
        }else{
            nextTeam = "A";
        }
    }

    function startTimer(){
        var time = $("#timer").text();
        $("#timer").text(time-1);
        crono = setTimeout(startTimer, 1000);
        if ( time-1 <= 0 ){
            clearTimeout(crono);
            stopTimer();
        }
    }

    function stopTimer(){
        $("#timer").text("20");
        for (user in localAuxusers) {
            if (user == name && localAuxusers[user].indexOf("#"+nextTeam+"#") >= 0) {
                socket.emit('rotateTurn', name, room, nextTeam);
            }
        }
    }

});
