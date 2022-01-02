/*
Autor: aazin#8560
Titulo: Comando info
Descrição: Criação de um sistema de info dos players.
Data de criação: 02/01/2022

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless

Comandos:
	!info nick
	Observação: insira o nome de um usuário para encontrar informações sobre ele.
	Exemplo: !info aazin
*/

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

// Info players
var info = new Map();

// Meses em português
var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Define o info para o player
function definir_info(player) {
	if (info.get(player.name)) {
		return;
	}
	else {
		info.set(player.name, {auth: player.auth, join: calendario()});
	}
}

// Calendario versão BR
function calendario(){
	let horario = new Date(),
	horas  = horario.getHours().toString().padStart(2, '0'),
	minutos  = horario.getMinutes().toString().padStart(2, '0'),
	segundos  = horario.getSeconds().toString().padStart(2, '0'),
	dia  = horario.getDate().toString().padStart(2, '0'),
	mes  = meses[horario.getMonth()],
	ano  = horario.getFullYear();
	return `${dia} de ${mes} de ${ano}, ${horas}:${minutos}:${segundos}`;
}

room.onPlayerChat = (player, message) => {
	if (message.substr(0, 6) == "!info ") { // !info nick
		const usuario = message.substr(6);
		if (info.get(usuario)) {
			room.sendAnnouncement(`Nome: ${usuario}\nAuth: ${info.get(usuario).auth}\nEntrou: ${info.get(usuario).join}`, player.id);
		}
		else {
			room.sendAnnouncement(`${usuario} ainda não entrou na sala.`, player.id);
		}
		return false;
	}
}

room.onPlayerJoin = (player) => {
	definir_info(player)
}