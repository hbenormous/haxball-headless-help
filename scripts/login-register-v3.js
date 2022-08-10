const account = {}, confirm = [];

const room = HBInit({});

room.onPlayerJoin = player => {

	if (!account[player.name]) room.sendAnnouncement("Se registre com o comando: !register senha", player.id);
	else room.sendAnnouncement(`Faça login na sua conta em 15 segundos.\n!login senha`, player.id);

	if ( account[player.name] && !confirm.includes(player.id) ) setTimeout(() => room.kickPlayer(player.id, "Faça login na sua conta.", false), 1000*15);

}

room.onPlayerLeave = player => confirm.splice(confirm.indexOf(player.id));

room.onPlayerChat = (player, message) => {

	if ( message[0][0] === "!" ) {
		message = message.toLowerCase();

		if ( message.substr(0, 10) === "!register " ) setAccount(player, message.substr(10));
		else if ( message.substr(0, 7) === "!login " ) login(player, message.substr(7));

		return !1;
	}

	room.sendAnnouncement(`${confirm.includes(player.id) ? "✔️" : "❌"} [#${player.id}]${player.name}: ${message}`, null);
	return !1;

}

function setAccount (player, password) {

	if ( account[player.name] ) return room.sendAnnouncement("Você já está registrado.", player.id);

	account[player.name] = password;
	room.sendAnnouncement(`Sua senha é: ${password}`, player.id);

}

function login (player, password) {

	if ( confirm.includes(player.id) ) room.sendAnnouncement("Você já confirmou.", player.id);
	else if ( !account[player.name] ) room.sendAnnouncement("Você não está registrado.", player.id);
	else if ( account[player.name] !== password ) room.sendAnnouncement("Senha incorreta.", player.id);
	else if ( !confirm.includes(player.id) ) {
		room.sendAnnouncement(`${player.name} confirmou!`, null);
		confirm.push(player.id);
	}

}
