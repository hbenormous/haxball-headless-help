/*
Autor: aazin#8560
Titulo: Sistema de shop
Descrição: Sistema de itens básicos + loja.
Data de criação: 08/01/2022

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless

Comandos:
	!me
	Observação: Mostra quantos itens você tem + seu dinheiro.

	!shop
	Observação: Mostra os itens disponíveis + preços.

	!buy nome
	Observação: Com este comando você faz uma compra na loja.
	Exemplo: !buy god

	!god
	Observação: Torna o seu personagem grande.

	!ant
	Observação: Ele torna seu personagem pequeno.
*/

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: false,
    noPlayer: true
});

// Itens config
const itens = new Map();

// Loja config
// ["nome", "preço"]
const info_dos_itens = [["god", 2], ["ant", 5]];

// Comandos
const inv_comando = ["!i", "!inv", "!inventario", "!itens", "!equipamentos", "!me", "!bolsa", "!equips"];
const shop_comando = ["!shop", "!loja", "!armazem", "!sh", "!mercado", "!s"];

// Gol config
var player_que_fez_o_gol;

// Emoji
const emoji = ["💵", "🙌", "🐜", "⚠️", "✔️"];

// Cores
const cores = {
	amarelo: 0xFFFF00,
	verde: 0x00FF00
};

// Tamanho dos jogadores
const god_size = 20;
const ant_size = 10;

function comparar_item(message) {
	if (message == info_dos_itens[0][0]) {
		return info_dos_itens[0][0]
	}
	else if (message == info_dos_itens[1][0]) {
		return info_dos_itens[1][0]
	}
}
function comparar_money(message) {
	if (message == info_dos_itens[0][0]) {
		return info_dos_itens[0][1]
	}
	else if (message == info_dos_itens[1][0]) {
		return info_dos_itens[1][1]
	}
}
function adicionar_item_ao_inventario(player, message) {
	if (message == info_dos_itens[0][0]) {
		itens.get(player.name).god += 1;
		itens.get(player.name).money -= info_dos_itens[0][1]
	}
	else if (message == info_dos_itens[1][0]) {
		itens.get(player.name).ant += 1;
		itens.get(player.name).money -= info_dos_itens[1][1]
	}
}

function buy_itens_sistema(player, message) {
	if (comparar_item(message)) {
		if (itens.get(player.name).money >= comparar_money(message)) {
			adicionar_item_ao_inventario(player, message);
			room.sendAnnouncement(`${emoji[4]} O item ${comparar_item(message)} foi comprado por ${comparar_money(message)} money.`, player.id, cores.verde);
		}
		else {
			room.sendAnnouncement(`${emoji[3]} Você não tem money suficiente.\n${emoji[0]} ${itens.get(player.name).money}`, player.id, cores.amarelo);
		}
	}
}

room.onPlayerChat = (player, message) => {
	// !shop
	if (shop_comando.includes(message.toLowerCase())) {
		room.sendAnnouncement(`1. ${info_dos_itens[0][0]} => ${info_dos_itens[0][1]} money\n`+
							  `2. ${info_dos_itens[1][0]} => ${info_dos_itens[1][1]} money`, player.id, cores.amarelo);
		return false;
	}
	// !buy itemName
	if (message.toLowerCase().substr(0, 5) == "!buy ") {
		buy_itens_sistema(player, message.substr(5));
		return false;
	}
	// !god
	if (message.toLowerCase() == "!god") {
		if (itens.get(player.name).god >= 1) {
			room.setPlayerDiscProperties(player.id, {radius: god_size});
			itens.get(player.name).god -= 1
		}
		else {
			room.sendAnnouncement(`${emoji[3]} Você não possui esse item.`, player.id, cores.amarelo);
		}
		return false;
	}
	// !ant
	if (message.toLowerCase() == "!ant") {
		if (itens.get(player.name).ant >= 1) {
			room.setPlayerDiscProperties(player.id, {radius: ant_size});
			itens.get(player.name).ant -= 1
		}
		else {
			room.sendAnnouncement(`${emoji[3]} Você não possui esse item.`, player.id, cores.amarelo);
		}
		return false;
	}
	// !me
	if (inv_comando.includes(message.toLowerCase())) {
		room.sendAnnouncement(`${emoji[1]} ${info_dos_itens[0][0]}: ${itens.get(player.name).god}\n`+
							  `${emoji[2]} ${info_dos_itens[1][0]}: ${itens.get(player.name).ant}\n`+
							  `${emoji[0]} money: ${itens.get(player.name).money}`, player.id);
		return false;
	}
}

room.onPlayerBallKick = (player) => {
	player_que_fez_o_gol = player;
}

room.onTeamGoal = (team) => {
	if (team == player_que_fez_o_gol.team){
		itens.get(player_que_fez_o_gol.name).money += 1;
	}
}

room.onPlayerJoin = (player) => {
	itens.get(player.name) ? false : itens.set(player.name, {god: 0, ant: 0, money: 0});
}
