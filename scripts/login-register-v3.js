var room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

var registro = new Map();

var log;

room.onPlayerJoin = function(player) {
	if (registro.get(player.name)) {
		room.sendAnnouncement('Faça login na sua conta em 15 segundos.', player.id);
		room.sendAnnouncement('!login senha', player.id);
		log = setTimeout(function(){ room.kickPlayer(player.id, 'Faça login na sua conta.', false); }, 1000*15);
	}
	else {
		room.sendAnnouncement('Se registre com o comando: !register senha', player.id);
	}
}

room.onPlayerChat = function(player, message) {

	if (message.substr(0, 10) == '!register ') {
    if (registro.get(player.name)) {
      room.sendAnnouncement('Você já está registrado.', player.id);
      return false;
    }
    else {
      registro.set(player.name, message.substr(10));
      room.sendAnnouncement('Registrado!', player.id);
      room.sendAnnouncement('Senha: ' + message.substr(10), player.id);
      return false;
    }
  }

  if (message.substr(0, 7) == '!login ') {
    if (registro.get(player.name)) {
    if (registro.get(player.name) == message.substr(7)) {
      room.sendAnnouncement(player.name + ' confirmou!');
      clearTimeout(log);
    }
    else {
      room.sendAnnouncement('Senha incorreta.', player.id);
    }
  }
  else {
    room.sendAnnouncement('Você não está registrado.', player.id);
  }
  return false;
}

	if (registro.get(player.name)) {
registrado = message;
room.sendAnnouncement ("[✔️] " + player.name + ": " + registrado, null);
return false;
}
else {
naoRegistrado = message;
room.sendAnnouncement ("[❌] " + player.name + ": " + naoRegistrado, null);
return false;
}

}