var hhh = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

var _registros = { nome: [], senha: [] };

hhh.onPlayerJoin = function(usuario) {
	hhh.sendAnnouncement('Registrar: !register senha', usuario.id);
	hhh.sendAnnouncement('Login: !login senha', usuario.id);
}

hhh.onPlayerChat = function(usuario, mensagem) {

	if (mensagem.substr(0, 10) == '!register ') {
		if (_registros.nome.includes(usuario.name)) {
			hhh.sendAnnouncement('Você já está registrado.');
		}
		else {
			_registros.senha.push(mensagem.substr(10));
			_registros.nome.push(usuario.name);
			hhh.sendAnnouncement('Registrado!', usuario.id);
			hhh.sendAnnouncement('Senha: ' + mensagem.substr(10), usuario.id);
		}
		return false;
	}

	if (mensagem.substr(0, 7) == '!login ') {
		if (_registros.nome.includes(usuario.name)) {
		if (_registros.nome.includes(usuario.name) && _registros.senha.includes(mensagem.substr(7))) {
			hhh.sendAnnouncement(usuario.name + ' confirmou!');
		}
		else if (_registros.senha !== mensagem.substr(7)) {
			hhh.sendAnnouncement('Senha incorreta.', usuario.id);
		}
	}
	else {
		hhh.sendAnnouncement('Você não está registrado.', usuario.id);
	}
	return false;
}

}