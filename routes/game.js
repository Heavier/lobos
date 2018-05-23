var express = require('express');
var router = express.Router();
var server = require('../bin/www');
var io = require('socket.io').listen(server);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('game', { title: 'Lobos · Playing' });
});

module.exports = router;

var usernames = {};
var rooms = ['room1', 'room2', 'room3'];

io.sockets.on('connection', function(socket){

    socket.on('addUser', function(username){
        socket.username = username;
        socket.room = 'room1';
        usernames[username] = username;
        socket.join('room1');
        socket.emit('updateChat', 'SERVER', 'Welcome to the amazing room1, a world of madness.');
        socket.broadcast.to('room1').emit('updateChat', 'SERVER', username + ' is finally here.');
        socket.emit('updateRooms', rooms, 'room1');
    });

    socket.on('sendChat', function(data){
        io.sockets.in(socket.room).emit('updateChat', socket.username, data);
    });

    socket.on('disconnect', function(){
        delete usernames[socket.username];
        io.sockets.emit('updateUsers', usernames);
        socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has gonne, maybe forever.');
        socket.leave(socket.room);
    });
});
