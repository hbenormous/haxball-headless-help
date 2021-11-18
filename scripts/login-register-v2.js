var room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

var _registros = { nome: [], senha: [] };

var log;

room.onPlayerJoin = function(player) {
	if (_registros.nome.includes(player.name)) {
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
      if (_registros.nome.includes(player.name)) {
          room.sendAnnouncement('Você já está registrado.', player.id);
      }
      else {
          _registros.senha.push(message.substr(10));
          _registros.nome.push(player.name);
          room.sendAnnouncement('Registrado!', player.id);
          room.sendAnnouncement('Senha: ' + message.substr(10), player.id);
      }
      return false;
  }

  if (message.substr(0, 7) == '!login ') {
      if (_registros.nome.includes(player.name)) {
      if (_registros.nome.includes(player.name) && _registros.senha.includes(message.substr(7))) {
          room.sendAnnouncement(player.name + ' confirmou!');
          clearTimeout(log);
      }
      else if (_registros.senha !== message.substr(7)) {
          room.sendAnnouncement('Senha incorreta.', player.id);
      }
  }
  else {
      room.sendAnnouncement('Você não está registrado.', player.id);
  }
  return false;
}

	if (_registros.nome.includes(player.name)) {
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
