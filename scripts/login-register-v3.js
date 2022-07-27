const account = {};
const confirm = [];

let room = HBInit({});

room.onPlayerJoin = player => {

	if (!account[player.name]) room.sendAnnouncement("Se registre com o comando: !register senha", player.id);
	else room.sendAnnouncement(`Faça login na sua conta em 15 segundos.\n!login senha`, player.id);

	setTimeout(() => {
		if ( account[player.name] ) {
			if ( !confirm.includes(player.id) ) room.kickPlayer(player.id, "Faça login na sua conta.", false);
		}
	}, 1000*15);

}

room.onPlayerLeave = player => confirm.splice(confirm.indexOf(player.id));

room.onPlayerChat = (player, message) => {

	if ( message.substr(0, 10) === "!register " ) {
		const password = message.substr(10);

		if ( account[player.name] ) room.sendAnnouncement("Você já está registrado.", player.id);
		else {
			account[player.name] = password;
			room.sendAnnouncement(`Sua senha é: ${password}`, player.id);
		}

		return false;
	}
	else if ( message.substr(0, 7) === "!login " ) {
		const password = message.substr(7);

		if ( !account[player.name] ) room.sendAnnouncement("Você não está registrado.", player.id);
		else if ( account[player.name] !== password ) room.sendAnnouncement("Senha incorreta.", player.id);
		else if ( confirm.includes(player.id) ) room.sendAnnouncement("Você já confirmou.", player.id);
		else if ( !confirm.includes(player.id) ) {
			room.sendAnnouncement(`${player.name} confirmou!`, null);
			confirm.push(player.id);
		}

		return false;
	}

	if ( account[player.name] ) { room.sendAnnouncement(`✔️ [#${player.id}]${player.name}: ${message}`, null); return false; }
	else { room.sendAnnouncement(`❌ [#${player.id}]${player.name}: ${message}`, null); return false; }

}
