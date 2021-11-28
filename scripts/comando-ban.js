/*
Autor: aazin#8560
Titulo: Ban comandos
Descrição: Criação de um sistema de banimento.
Data de criação: 28/11/2021

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless

Comandos:
	1234
	Observação: você pode definir a senha alterando a string da senha.
	Exemplo: var senha = '248527';

	!ban nome
	Observação: o nome que você digitou será banido de sua sala para sempre.
	Exemplo: !ban jogador

	!rban nome
	Observação: o nome que você digitou será removido dos banimentos.
	Exemplo: !rban buti

	!bans
	Observação: mostra jogadores banidos em sua sala.
*/

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

var banidos = []; // Banidos.
var admins = []; // Admins.
var senha = '1234'; // Senha de admin.

room.onPlayerJoin = function(player) {
	if (banidos.includes(player.name)) { // Verifique se dentro da array de banidos existe o jogador que acabou de entrar, caso tenha ele será banido da sala.
		room.kickPlayer(player.id, 'Banido!', true);
	}
}

room.onPlayerChat = function(player, message) {
	if (message == senha) { // Comando com a senha de admin.
		if (admins.includes(player.name)) {
			room.sendAnnouncement('Você já é admin.', player.id);
		}
		else {
			admins.push(player.name); // Adicione o nome do jogador ao array admins.
			room.sendAnnouncement('Pronto!\nAgora você é admin.', player.id);
		}
		return false;
	}
	else if (message.substr(0, 5) == '!ban ') { // Comando para banir alguém. !ban nome
		if (admins.includes(player.name)) { // Verifique se o jogador tem seu nome na array de admins.
		if (banidos.includes(message.substr(5))) {
			room.sendAnnouncement('Esse usuário já está banido!', player.id);
		}
		else {
			room.sendAnnouncement('Pronto!\nUsuário banido: ' + message.substr(5), player.id);
			banidos.push(message.substr(5));
		}
	}
	else {
	room.sendAnnouncement('Você não tem permissão.', player.id);
	}
		return false;
	}
	else if (message == '!bans') { // Comando para ver quem foi banido.
		room.sendAnnouncement(banidos.join(', '), player.id);
		return false;
	}
	else if (message.substr(0, 6) == '!rban ') {
		if (admins.includes(player.name)) { // Verifique se o jogador tem seu nome na array de admins.
			if (banidos.includes(message.substr(6))) {
				room.sendAnnouncement('Usuário desbanido: ' + message.substr(6));
				banidos.shift(message.substr(6)); // Remova o nome que você digitou.
			}
			else {
				room.sendAnnouncement('Esse usuário não foi banido.', player.id);
			}
		}
		else {
			room.sendAnnouncement('Você não tem permissão.', player.id);
		}
			return false;
	}
}