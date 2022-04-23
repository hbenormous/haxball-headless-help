let room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

let
prefix = "!",
afks = [];

let Commands = {
	afk: player=>{
		if (afks.includes(player.id)) {
			afks.splice(afks.indexOf(player.id), 1);
			room.sendAnnouncement(`${player.name} ficou disponível.`, null, null, "bold", 2);
		}
		else {
			room.sendAnnouncement(`${player.name} ficou ausente.`, null, null, "bold", 2);
			if (player.team != 0) room.setPlayerTeam(player.id, 0);
			afks.push(player.id);
		}
	},
	afks: player=>{
		let players = room.getPlayerList().filter(callback=> afks.includes(callback.id)).map(callback=> callback.name);
		room.sendAnnouncement(`${afks.length ? players.join(', ') : "Nenhum player esta ausente."}`, player.id, null, "bold", 2);
	}
};

room.onPlayerChat = (player, message) => {
	if (Object.keys(Commands).map(command=> `${prefix}${command}`).includes(message.toLowerCase())) {
		Commands[message.slice(1)](player);
		return false;
	}
}

room.onPlayerTeamChange = (changedPlayer, byPlayer) => {
	if (afks.includes(changedPlayer.id)) {
		room.setPlayerTeam(changedPlayer.id, 0);
		if (byPlayer) room.sendAnnouncement(`${changedPlayer.name} está afk e não pode ser movido.`, null, null, "bold", 2);
	}
}

room.onPlayerLeave = player => {
	if (afks.includes(player.id)) afks.splice(afks.indexOf(player.id), 1);
}
