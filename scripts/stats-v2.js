let room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

let
playerStatsObject = {},
playerConnsObject = {};

let StatsSistem = {
	sendRanking: player=>{
		let playerSort = Object.entries(playerStatsObject).sort((a, b) => b[1].vitorias - a[1].vitorias).slice(0, 3);

		room.sendAnnouncement("R A N K I N G  -  VITÓRIAS", player.id, null, "bold");

		for ( let [key, value] of playerSort) setTimeout(()=> room.sendAnnouncement(`${ value.name }   =   ${value.vitorias}`, player.id, null), 50);
	},
	teamVictory: scores=>{
		let
		red = room.getPlayerList().filter(callback=> callback.team == 1),
		blue = room.getPlayerList().filter(callback=> callback.team == 2);

		if (scores.red > scores.blue) { vencedor = red; perdedor = blue; }
		else { vencedor = blue; perdedor = red; }

		for (let i = 0; i < vencedor.length; i++) playerStatsObject[ playerConnsObject[ vencedor[i].id ] ].vitorias += 1;
		for (let i = 0; i < perdedor.length; i++) playerStatsObject[ playerConnsObject[ perdedor[i].id ] ].derrotas += 1;
	}
};

room.onTeamVictory = scores => {
	StatsSistem.teamVictory(scores);
}

room.onPlayerJoin = player => {
	playerConnsObject[player.id] = player.conn;
	if (!playerStatsObject[player.conn]) playerStatsObject[player.conn] = { vitorias: 0, derrotas: 0, name: player.name };
}

room.onPlayerLeave = player => {
	delete playerConnsObject[player.id];
}

room.onPlayerChat = (player, message) => {
	if (message.toLowerCase() == "!me") {
		room.sendAnnouncement(`Vitorias: ${playerStatsObject[playerConnsObject[player.id]].vitorias}, Derrotas: ${playerStatsObject[playerConnsObject[player.id]].derrotas}`, player.id);
		return false;
	}
	if (message.toLowerCase() == "!rank") {
		StatsSistem.sendRanking(player);
		return false;
	}
}