/*
Autor: aazin#8560
Titulo: Mute comandos
Descrição: Criação de um sistema de mute.
Data de criação: 08/12/2021

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless

Comandos:
	!mute nick
	Observação: Não deixa o jogador enviar mais mensagens.
	Exemplo: !mute aazin

	!unmute nick
	Observação: Remove o jogador da lista de jogadores silenciados.
	Exemplo: !unmute aazin

	!mutes
	Observação: Mostra jogadores que foram silenciados.
*/

var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

var mutados = []; // Jogadores silenciados estarão dentro do array.

function mute(message, player) {
	room.sendAnnouncement(mutados.includes(message) ? `${message} já está mutado.` : `${message} foi mutado.\nMutados: ${mutados.push(message)}`, player);
}

function unmute(message, player) {
	if (mutados.includes(message)) {
		var remover = mutados.indexOf(message);
		mutados.splice(remover, 1);
		room.sendAnnouncement(message + " pode falar agora.");
	}
	else {
		room.sendAnnouncement(message + " não foi mutado.", player);
	}
}

function mutes(player) {
	room.sendAnnouncement(mutados.length ? `Mutes: ${mutados.join(", ")}` : "Ninguém foi mutado.", player);
}

room.onPlayerChat = function(player, message) {
	if (mutados.includes(player.name)) {
		room.sendAnnouncement("Você está mutado.", player.id);
		return false;
	}
	else if (message.substr(0, 6) == "!mute ") {
		mute(message.substr(6), player.id);
		return false;
	}
	else if (message.substr(0, 8) == "!unmute ") {
		unmute(message.substr(8), player.id);
		return false;
	}
	else if (message == "!mutes") {
		mutes(player.id);
		return false;
	}
}
