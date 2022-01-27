/**
* @Autor: aazin#8560
* @Titulo: Comando pause
* @Descrição: Comando para pausar o jogo.
* @Versão: 1
* @Data_de_criação: 26/01/2022
* 
* @Contatos:
* 	Discord: https://discord.gg/UWYuxwEKfn
*   Site: https://haxballheadlesshelp.ueuo.com/
*   Github: https://github.com/hbenormous/haxball-headless-help
* 
* @Links:
*   Haxball Headless Host: https://www.haxball.com/headless
* 	Booleans: https://www.w3schools.com/js/js_booleans.asp
* 
* @Comandos:
*	!p
*	Descrição: Pause o jogo pelo tempo determinado na variável timeDePause.
*/

// Definindo função HBInit
var room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

/**
* @Multiplicação = *
* @Divisão = /
* 500 = 0.5ms
* 1000 = 1s
* 1000 * 5 = 5s (5000)
* 1000 * 60 = 60s (60000)
* 1000 * 60 * 2 = 2m (120000)
*/

var tempoDePause = 1000*5; // 5 segundos de pause.
var pausePlayers = []; // Os players que digitarem o comando "!p" terão seus Ids puxados para um array "pausePlayers".
var pauseGame = true; // Pause = true | unPause = false.
var partida = true; // Partida não iniciada = true | Partida iniciada = false.

// Cada jogador que está jogando tem a chance de pausar o jogo apenas uma vez.
function pausar(player) {
	if (partida == true) room.sendAnnouncement("A partida ainda não começou.", player.id);
	else {
		if (player.team != 0) {
			if (pausePlayers.includes(player.id)) room.sendAnnouncement("Você não pode pausar a partida até que ele termine.", player.id);
			else {
				if (pauseGame == true) room.sendAnnouncement("A partida já está pausada.", player.id);
				else {
					pausePlayers.push(player.id);
					room.sendAnnouncement(`${player.name} pausou a partida por ${tempoDePause/1000} segundos.`, null); // tempoDePause dividido por 1000 = 5
					room.pauseGame(true);
					setTimeout(_=> {room.pauseGame(false);}, tempoDePause);
				}
			}
		}
		else room.sendAnnouncement("Você não está em nenhum time.", player.id);
	}
}

function removerPlayer(player) {
	if (pausePlayers.includes(player.id)) {
		pausePlayers.splice(pausePlayers.indexOf(player.id), 1);
	}
}

function resetPause() {
	pausePlayers = [];
	pauseGame = false;
	partida = false;
}

room.onPlayerChat = (player, message) => {
	if (message.toLowerCase() == "!p") {
		pausar(player);
		return false;
	}
}

room.onGameStart = (player) => {
	resetPause();
}

room.onGameStop = (player) => {
	partida = true;
}

room.onPlayerLeave = (player) => {
	removerPlayer(player);
}

room.onGamePause = (byPlayer) => {
	pauseGame = true;
}

room.onGameUnpause = (byPlayer) => {
	pauseGame = false;
}
