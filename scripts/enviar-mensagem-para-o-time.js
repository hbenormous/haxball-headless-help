let room = HBInit({});

let prefixTeamChatString = "!t ";

room.onPlayerChat = (player, message) => {
	if (message.substr(0, prefixTeamChatString.length) == prefixTeamChatString) {
		room.getPlayerList()
		.filter(callback => callback.team == player.team)
		.forEach(callback => {
			room.sendAnnouncement(`TEAM > ${player.name}: ${message.substr(prefixTeamChatString.length)}`, callback.id, player.team == 1 ? 0xff7b73 : player.team == 0 ? 0xe4ffb6 : 0x38b5ff);
		});
		return false;
	}
}