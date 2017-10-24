/* global $, io, Crypt, i*/
$(document).ready(function () {
	var socket = io.connect();
	//var socket = io.connect('http://khanabdullah.com:8080');
	//message screen
	var $messageArea = $('#messageArea');
	var $messageForm = $('#messageForm');
	var $message = $('#message');
	var $users = $('#users');
	//chat screen
	var $chat = $('#chat');
	//login area
	var $loginForm = $('#loginForm');
	var $loginArea = $('#loginArea');
	var $username = $('#username');

	var passphrase = 'fcf8afd67e96fa3366dd8eafec8bcace',
		crypter = Crypt(passphrase),
		id = 0;
	socket.on('connect', function () {
		//console.log("connected! Let's start the counter with: " + id);
		socket.emit('counter', crypter.encrypt({
			id: id
		}));
	});
	socket.on('counter', function (data) {
		var decriptedData = crypter.decrypt(data);
		//console.log("counter status: " + decriptedData.id);
		socket.emit('counter', crypter.encrypt({
			id: decriptedData.id
		}));
		//console.log(socket.username + ": " + crypter.decrypt(data) + " (decrypted)");
	});

	$messageForm.submit(function (e) {
		e.preventDefault();
		if ($message.val() != "" && $message.val().length <= 27) {
			socket.emit('sendMsg', $message.val());
			$message.val('');
		} else {
			alert("Please enter a valid message. The character limit for each message is 27.");
		}
	});

	socket.on('newMsg', function (data) {
		$chat.append('<div class="well message"><strong>' + data.user + ': </strong>' + data.msg + ' </div>');
	});

	$loginForm.submit(function (e) {
		e.preventDefault();
		if ($username.val() != "") {
			socket.emit('newUser', $username.val(), function (data) {
				if (data) {
					$loginForm.hide();
					$messageArea.show();
					$loginArea.hide();
				}
			});
		} else {
			alert("Please enter an actual username. Remember, everyone will see this name.");
		}
		$username.val('');
	});

	socket.on('getUsers', function (data) {
		var html = '';


		for (i = 0; i < data.length; i++) {
		    //let id = i + 1;
			html += '<li id="' + id + '" class="list-group-item"><i class="fa fa-circle" style="color: #40f23a;"></i> ' + data[i] + (id == 1 ? "   (you)" : "") + ' </li>';
			html += '<li id="' + id + '" class="list-group-item"><i class="fa fa-circle" style="color: #40f23a;"></i> ' + data[i] + (id == 1 ? "   (you)" : "") + ' </li>';
		}
        // console.log(data[0]);
		$users.html(html);
	});

});