/*
Autor: aazin#8560
Titulo: Script de posições
Descrição: Script de posição (gk, def1, def2 e atk), recomendado para bots automáticos.
Data de criação: 07/12/2021

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless

Comandos:
	!gk
	Observação: Deixa você posicionado próximo à área do goleiro.

	!def1
	Observação: Deixa você posicionado no topo.

	!def2
	Observação: Deixa você posicionado embaixo.

	!atk
	Observação: Deixa você posicionado perto da área da bola.
*/

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});
// Todas as posições baseadas no mapa Big
room.setDefaultStadium("Big");

// Mapear area do red
var posi_red = {
	gk: {x: -500, y: 0},
	def1: {x: -300, y: -100},
	def2: {x: -300, y: 100},
	atk: {x: -100, y: 0}
};
// Mapear area do blue
var posi_blue = {
	gk: {x: 500, y: 0},
	def1: {x: 300, y: -100},
	def2: {x: 300, y: 100},
	atk: {x: 100, y: 0}
};

// Players do time red com suas pos
var usuarios_posi_red = {
	gk: [],
	def1: [],
	def2: [],
	atk: []
};
// Players do time blue com suas pos
var usuarios_posi_blue = {
	gk: [],
	def1: [],
	def2: [],
	atk: []
}
// Times
var time = {
	spect: 0,
	red: 1,
	blue: 2
};
// Comandos
var comandos = {
	gk: "!gk",
	def1: "!def1",
	def2: "!def2",
	atk: "!atk"
};
// Mensagens
var mensagem_1 = "Essa posição já foi escolhida.";
var mensagem_2 = "__________________Escolha suas posições__________________\n";
var mensagem_4 = "O jogo vai começar.";
// Cores
var cores = {
	vermelho: 0xFF0000,
	verde: 0x00FF7F,
	amarelo: 0xADFF2F
};
// tempos
var tempo;
var temporizador = 4; // Tempo para enviar mensagem com as pos

// Mensagem para times
function mensagem_time(message, cor, time) {
	const players = room.getPlayerList().filter(player => player.team == time);
	if (players.length > 0) {
        players.forEach(player => {
            room.sendAnnouncement(message, player.id, cor);
        });
    }
}
// Enviar posições livres e ocupadas
function enviar_posicoes(player) {
	// Time red.
	mensagem_time(mensagem_2, cores.amarelo, time.red);
	if (usuarios_posi_red.gk.length == 0) {
		mensagem_time(comandos.gk, cores.verde, time.red);
	}
	else {
		mensagem_time(comandos.gk, cores.vermelho, time.red);
	}
	if (usuarios_posi_red.def1.length == 0) {
		mensagem_time(comandos.def1, cores.verde, time.red);
	}
	else {
		mensagem_time(comandos.def1, cores.vermelho, time.red);
	}
	if (usuarios_posi_red.def2.length == 0) {
		mensagem_time(comandos.def2, cores.verde, time.red);
	}
	else {
		mensagem_time(comandos.def2, cores.vermelho, time.red);
	}
	if (usuarios_posi_red.atk.length == 0) {
		mensagem_time(comandos.atk, cores.verde, time.red);
	}
	else {
		mensagem_time(comandos.atk, cores.vermelho, time.red);
	}

	// Time blue.
	mensagem_time(mensagem_2, cores.amarelo, time.blue);
	if (usuarios_posi_blue.gk.length == 0) {
		mensagem_time(comandos.gk, cores.verde, time.blue);
	}
	else {
		mensagem_time(comandos.gk, cores.vermelho, time.blue);
	}
	if (usuarios_posi_blue.def1.length == 0) {
		mensagem_time(comandos.def1, cores.verde, time.blue);
	}
	else {
		mensagem_time(comandos.def1, cores.vermelho, time.blue);
	}
	if (usuarios_posi_blue.def2.length == 0) {
		mensagem_time(comandos.def2, cores.verde, time.blue);
	}
	else {
		mensagem_time(comandos.def2, cores.vermelho, time.blue);
	}
	if (usuarios_posi_blue.atk.length == 0) {
		mensagem_time(comandos.atk, cores.verde, time.blue);
	}
	else {
		mensagem_time(comandos.atk, cores.vermelho, time.blue);
	}
}

// Posicione o jogador
function executar_comandos(player, message) {
	// Time red.
	if (message == comandos.gk & player.team == time.red) {
		if (usuarios_posi_red.gk.length == 1) {
			room.sendAnnouncement(mensagem_1, player.id);
		}
		else {
			usuarios_posi_red.gk.push(player.id);
			if (usuarios_posi_red.def1.includes(player.id)) {
				usuarios_posi_red.def1.shift(player.id);
			}
			else if (usuarios_posi_red.def2.includes(player.id)) {
				usuarios_posi_red.def2.shift(player.id);
			}
			else if (usuarios_posi_red.atk.includes(player.id)) {
				usuarios_posi_red.atk.shift(player.id);
			}	
			room.setPlayerDiscProperties(player.id, posi_red.gk);
		}
		return false;
	}
	if (message == comandos.def1 & player.team == time.red) {
		if (usuarios_posi_red.def1.length == 1) {
			room.sendAnnouncement(mensagem_1, player.id);
		}
		else {
			usuarios_posi_red.def1.push(player.id);
			if (usuarios_posi_red.gk.includes(player.id)) {
				usuarios_posi_red.gk.shift(player.id);
			}
			else if (usuarios_posi_red.def2.includes(player.id)) {
				usuarios_posi_red.def2.shift(player.id);
			}
			else if (usuarios_posi_red.atk.includes(player.id)) {
				usuarios_posi_red.atk.shift(player.id);
			}	
			room.setPlayerDiscProperties(player.id, posi_red.def1);
		}
		return false;
	}
	if (message == comandos.def2 & player.team == time.red) {
		if (usuarios_posi_red.def2.length == 1) {
			room.sendAnnouncement(mensagem_1, player.id);
		}
		else {
			usuarios_posi_red.def2.push(player.id);
			if (usuarios_posi_red.gk.includes(player.id)) {
				usuarios_posi_red.gk.shift(player.id);
			}
			else if (usuarios_posi_red.def1.includes(player.id)) {
				usuarios_posi_red.def1.shift(player.id);
			}
			else if (usuarios_posi_red.atk.includes(player.id)) {
				usuarios_posi_red.atk.shift(player.id);
			}	
			room.setPlayerDiscProperties(player.id, posi_red.def2);
		}
		return false;
	}
	if (message == comandos.atk & player.team == time.red) {
		if (usuarios_posi_red.atk.length == 1) {
			room.sendAnnouncement(mensagem_1, player.id);
		}
		else {
			usuarios_posi_red.atk.push(player.id);
			if (usuarios_posi_red.gk.includes(player.id)) {
				usuarios_posi_red.gk.shift(player.id);
			}
			else if (usuarios_posi_red.def1.includes(player.id)) {
				usuarios_posi_red.def1.shift(player.id);
			}
			else if (usuarios_posi_red.def2.includes(player.id)) {
				usuarios_posi_red.def2.shift(player.id);
			}	
			room.setPlayerDiscProperties(player.id, posi_red.atk);
		}
		return false;
	}

	// Time blue.
	//gk blue
	if (message == comandos.gk & player.team == time.blue) {
		if (usuarios_posi_blue.gk.length == 1) {
			room.sendAnnouncement(mensagem_1, player.id);
		}
		else {
			usuarios_posi_blue.gk.push(player.id);
			if (usuarios_posi_blue.def1.includes(player.id)) {
				usuarios_posi_blue.gk.shift(player.id);
			}
			else if (usuarios_posi_blue.def1.includes(player.id)) {
				usuarios_posi_blue.def2.shift(player.id);
			}
			else if (usuarios_posi_blue.def2.includes(player.id)) {
				usuarios_posi_blue.atk.shift(player.id);
			}
			room.setPlayerDiscProperties(player.id, posi_blue.gk);
		}
		return false;
	}
	// def1 blue
	if (message == comandos.def1 & player.team == time.blue) {
		if (usuarios_posi_blue.def1.length == 1) {
			room.sendAnnouncement(mensagem_1, player.id);
		}
		else {
			usuarios_posi_blue.def1.push(player.id);
			if (usuarios_posi_blue.gk.includes(player.id)) {
				usuarios_posi_blue.gk.shift(player.id);
			}
			else if (usuarios_posi_blue.def2.includes(player.id)) {
				usuarios_posi_blue.def2.shift(player.id);
			}
			else if (usuarios_posi_blue.atk.includes(player.id)) {
				usuarios_posi_blue.atk.shift(player.id);
			}
			room.setPlayerDiscProperties(player.id, posi_blue.def1);
		}
		return false;
	}
	// def2 blue
	if (message == comandos.def2 & player.team == time.blue) {
		if (usuarios_posi_blue.def2.length == 1) {
			room.sendAnnouncement(mensagem_1, player.id);
		}
		else {
			usuarios_posi_blue.def2.push(player.id);
			if (usuarios_posi_blue.gk.includes(player.id)) {
				usuarios_posi_blue.gk.shift(player.id);
			}
			else if (usuarios_posi_blue.def1.includes(player.id)) {
				usuarios_posi_blue.def1.shift(player.id);
			}
			else if (usuarios_posi_blue.atk.includes(player.id)) {
				usuarios_posi_blue.atk.shift(player.id);
			}
			room.setPlayerDiscProperties(player.id, posi_blue.def2);
		}
		return false;
	}
	// atk blue
	if (message == comandos.atk & player.team == time.blue) {
		if (usuarios_posi_blue.atk.length == 1) {
			room.sendAnnouncement(mensagem_1, player.id);
		}
		else {
			usuarios_posi_blue.atk.push(player.id);
			if (usuarios_posi_blue.gk.includes(player.id)) {
				usuarios_posi_blue.gk.shift(player.id);
			}
			else if (usuarios_posi_blue.def1.includes(player.id)) {
				usuarios_posi_blue.def1.shift(player.id);
			}
			else if (usuarios_posi_blue.def2.includes(player.id)) {
				usuarios_posi_blue.def2.shift(player.id);
			}
			room.setPlayerDiscProperties(player.id, posi_blue.atk);
		}
		return false;
	}
}
// Verificar se todas as posições estão vazias ou cheias
function verificar_posicoes(player) {
	if (usuarios_posi_red.gk.length == 0 & usuarios_posi_red.def1.length == 0 & usuarios_posi_red.def2.length == 0 & usuarios_posi_red.atk.length == 0 & usuarios_posi_blue.gk.length == 0 & usuarios_posi_blue.def1.length == 0 & usuarios_posi_blue.def2.length == 0 & usuarios_posi_blue.atk.length == 0) {
		tempo = setInterval(() => {
			enviar_posicoes(player);
			if (usuarios_posi_red.gk.length == 1 & usuarios_posi_red.def1.length == 1 & usuarios_posi_red.def2.length == 1 & usuarios_posi_red.atk.length == 1 & usuarios_posi_blue.gk.length == 1 & usuarios_posi_blue.def1.length == 1 & usuarios_posi_blue.def2.length == 1 & usuarios_posi_blue.atk.length == 1) {
		clearInterval(tempo);
		room.pauseGame(false);
		room.sendAnnouncement(mensagem_4);
	}
		}, 1000 * temporizador);
		room.pauseGame(true);
	}
}
// Apagar jogadores das posições
function apagar_posicao_de_jogador() {
	// Time red.	
		usuarios_posi_red.gk.shift();
		usuarios_posi_red.def1.shift();
		usuarios_posi_red.def2.shift();
		usuarios_posi_red.atk.shift();
	// Time blue.
		usuarios_posi_blue.gk.shift();
		usuarios_posi_blue.def1.shift();
		usuarios_posi_blue.def2.shift();
		usuarios_posi_blue.atk.shift();
}

room.onPlayerChat = function(player, message) {
	executar_comandos(player, message);
}
room.onGameStart = function(player) {
	verificar_posicoes(player);
	apagar_posicao_de_jogador();
}
room.onGameStop = function() {
	clearInterval(tempo);
	apagar_posicao_de_jogador();
}
room.onPlayerLeave = function(player) {
	apagar_posicao_de_jogador();
}
