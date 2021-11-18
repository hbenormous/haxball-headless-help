var room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

var _registros = { nome: [], senha: [] };

room.onPlayerJoin = function(player) {
	room.sendAnnouncement('Registrar: !register senha', player.id);
	room.sendAnnouncement('Login: !login senha', player.id);
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

}
