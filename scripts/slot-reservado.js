/*
Autor: aazin#8560
Titulo: Slot Reservado
Descrição: Slot reservado para players que estão dentro da variável vips.
Data de criação: 18/01/2022

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless

Comandos:
	!add nick
	Observação: digite um nome de usuário para adicioná-lo à lista de jogadores vips.
	Exemplo: !add aazin
*/

var maxPlayers = 10; // Número de players que a sala pode lidar.

// Definindo função HBInit
var room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: maxPlayers,
	public: true,
	noPlayer: true
});

var vips = []; // Players VIP são armazenados aqui.

function slot(player) {
	var players = room.getPlayerList();
	if(players.length > maxPlayers-vips.length){
		if (vips.includes(player.name)) room.sendAnnouncement('Slot reservado.');
		else room.kickPlayer(player.id, 'Últimos lugares reservados para VIPs.', false);
	}
}

function addSlotPlayer(player, message) {
	if (player.admin) {
		if (vips.includes(message)) room.sendAnnouncement(`[ERRO] você não pode adicionar o mesmo nick duas vezes.`, player.id, 0xFF0000);
		else {
			vips.push(message);
			room.sendAnnouncement(
				`${message} foi adicionado à lista de vips.\n`+
				`Vip Players: ${vips.join(", ")}`, player.id);
		}
	}
	else room.sendAnnouncement(`${player.name}, você não tem permissão para executar este comando.`, player.id);
}

room.onPlayerChat = (player, message) => {
	if (message.toLowerCase().substr(0,5)=="!add ") {
		addSlotPlayer(player, message.substr(5));
		return false;
	}
}

room.onPlayerJoin = (player) => {
	slot(player);
}