let room = HBInit({});

let
infoCommand = "!info "
PlayerInfoObject = {};

room.onPlayerChat = (player, message) => {
	/* !info playerID */
	if (message.toLowerCase().substr(0, infoCommand.length) == infoCommand) {
		let user = message.substr(infoCommand.length);

		if (!PlayerInfoObject[user]) room.sendAnnouncement("Nunca entrou na sala.", player.id);
		else room.sendAnnouncement(`ID: ${user}\nAUTH: ${PlayerInfoObject[user].auth}\nJOIN IN: ${PlayerInfoObject[user].join}`, player.id);
		return false;
	}
}

room.onPlayerJoin = player => {
	if (!PlayerInfoObject[player.id]) {
		PlayerInfoObject[player.id] = {
			auth: player.auth,
			join: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
		};
	}
}
