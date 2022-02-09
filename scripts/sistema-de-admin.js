/**
 * @author aazin#8560
 * @title Sistema de administração
 * @description  Sistema de administração + administrador confirmado não perde administrador e não pode ser banido ou kick.
 * @version 1.0
 * @date 09/02/2022
 * @match https://www.haxball.com/headless
 * 
 * @contatos
 *      Discord: https://discord.gg/UWYuxwEKfn
 *      Site: https://haxballheadlesshelp.ueuo.com/
 *      Github: https://github.com/hbenormous/haxball-headless-help
 * 
 * @links
 *      Haxball Headless Host: https://www.haxball.com/headless
 */

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true /* noPlayer tem que ser = true. */
});

let admin = []; // Administradores.
let adminPassword = "!123"; // Senha do administrador.

function antUnAdmin(changedPlayer, byPlayer) {
	if (byPlayer) {
		if (changedPlayer.admin == true) {
			if (admin.includes(byPlayer.name)) return;
			else room.setPlayerAdmin(changedPlayer.id, false);
		}
		if (admin.includes(changedPlayer.name)) {
			room.setPlayerAdmin(changedPlayer.id,true);
			room.setPlayerAdmin(byPlayer.id,false);
		}
	}
}

function unKickBanAdmin(kickedPlayer, reason, ban, byPlayer) {
	if (byPlayer) {
		if (admin.includes(kickedPlayer.name)) {
			if (!admin.includes(byPlayer.name)) {
				room.kickPlayer(byPlayer.id, `Você não pode ${ban == true ? "banir":"kick"} um admin confirmado.`, true);
				room.clearBan(kickedPlayer.id);
			}
		}
	}
}

room.onPlayerChat=(player, message)=>{
	// !123
	if (message==adminPassword) {
		if (!admin.includes(player.name)) admin.push(player.name);
		room.setPlayerAdmin(player.id,true);
		return false;
	}
	// !admins
	if (message.toLowerCase()=="!admins") {
		room.sendAnnouncement(`𝙖𝙙𝙢𝙞𝙣𝙨: ${admin.length ? admin.join(", ") : "Nenhum admin foi adicionado."}`, player.id);
		return false;
	}
	// !clearbans
	if (message.toLowerCase()=="!clearbans") {
		if (!admin.includes(player.name)) room.sendAnnouncement("Você não tem permissão para usar esse comando.", player.id);
		else {
			room.clearBans();
			room.sendAnnouncement("Bans resetados.", player.id);
		}
		return false;
	}
}

room.onPlayerAdminChange = function(changedPlayer, byPlayer) {
	antUnAdmin(changedPlayer, byPlayer);
}

room.onPlayerKicked=(kickedPlayer, reason, ban, byPlayer)=>{
	unKickBanAdmin(kickedPlayer, reason, ban, byPlayer);
}