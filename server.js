//require express and make an express application
var express = require('express');
var app = express();

var server = require('http').createServer(app);
//require socket.io and listen to server
var io = require('socket.io').listen(server);

var Crypt = require("g-crypt"),
    passphrase = 'fcf8afd67e96fa3366dd8eafec8bcace',
    crypter = Crypt(passphrase);

// use 'client' folder to GET client-side files
app.use(express.static('client'));

var users = [];
var connections = [];

server.listen(process.env.PORT);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//when someone connects
io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('New connection detected! (Total connections: %s)', connections.length);
    socket.on('counter', function(data) {
        var decriptedData = crypter.decrypt(data);
        //prints sent/recieved encryptred messages in console
        //console.log(socket.username + ": " + data);
        setTimeout(function() {
            //console.log("counter status: " + decriptedData.id);
            decriptedData.id++;
            socket.emit('counter', crypter.encrypt(decriptedData));
            //console.log(crypter.encrypt(decriptedData));
        }, 1000);
    });
    //when a client has disconnected
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("A client has disconnected (Total connections now: %s)", connections.length);
    });

    //send message
    socket.on('sendMsg', function(data) {
        if (data.trim() != "" && data.length <= 27) {
            io.sockets.emit('newMsg', {
                msg: data,
                user: socket.username
            });
        }
        console.log(socket.username + ": " + crypter.encrypt(data));
        //console.log(socket.username + ": " + crypter.decrypt(data) + " (decrypted)");
    });

    //new user
    socket.on('newUser', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    //update user names function
    function updateUserNames() {
        io.sockets.emit('getUsers', users);
    }
});
console.log("server is live!");