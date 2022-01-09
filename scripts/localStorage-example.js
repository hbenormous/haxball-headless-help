/*
Autor: aazin#8560
Titulo: LocalStorage example
Descrição: Criação de um sistema de info dos players + localStorage example.
Data de criação: 09/01/2022

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

// Define o info para o player
function definir_info(player) {
	if (info.get(player.name)) {
		return;
	}
	else {
		info.set(player.name, {auth: player.auth, conn: player.conn});
		localStorage.setItem("info", JSON.stringify([...info])); // Transforma o OBJETO em string.
	}
}

// Quando a sala estiver pronta, os dados serão implementados em variável info.
room.onRoomLink = (link) => {
	if (localStorage.getItem("info") == null) { // Se a key "info" não existe, ela não obtém os dados salvos.
		return;
	}
	else { // Se houver, ele extrai os dados salvos em variável info.
		info = new Map(JSON.parse(localStorage.info));
	}
}

room.onPlayerChat = (player, message) => {
	if (message.toLowerCase().substr(0, 6) == "!info ") { // !info nick
		const usuario = message.substr(6);
		if (info.get(usuario)) {
			room.sendAnnouncement(
				`Nome: ${usuario}\n`+
				`Auth: ${info.get(usuario).auth}\n`+
				`Conn: ${info.get(usuario).conn}`, player.id);
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