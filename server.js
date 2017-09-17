//require express and make an express application
var express = require('express');
var app = express();

var server = require('http').createServer(app);
//require socket.io and listen to server
var io = require('socket.io').listen(server);
// use 'client' folder to GET client-side files
app.use(express.static('client'));

var users = [];
var connections = [];

server.listen(process.env.PORT || 8000);
console.log("server is live!");
console.log("http://localhost:8000");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//when someone connects
io.sockets.on('connection', function(socket) {
  connections.push(socket);
  console.log('New connection detected! (Total connections: %s)', connections.length);

  //when a client has disconnected
  socket.on('disconnect', function(data){
    //if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUserNames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("A client has disconnected (Total connections now: %s)", connections.length);
  });

  //send message
  socket.on('sendMsg', function(data){
    //prints sent/recieved messages in cmd
    console.log(socket.username + ": " + data);
    io.sockets.emit('newMsg', {msg: data, user: socket.username});
  });

  //new user
  socket.on('newUser', function(data, callback){
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
