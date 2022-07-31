const account = {}, auth = {};

const room = HBInit({});

room.onTeamVictory = setStats_teamVictory;

room.onPlayerJoin = player => {

	if ( !account[player.auth] ) account[player.auth] = { "wins":0, "defeats":0 };

	auth[player.id] = player.auth;

}

room.onPlayerLeave = player => delete auth[player.id];

room.onPlayerChat = (player, message) => {

	if ( message.toLowerCase() === "!me" ) { sendStats(player);return false; }

}

/*
FUNCTIONS
onTeamVictory: setStats_teamVictory( scores:ScoresObject )
onPlayerChat: sendStats( player:PlayerObject )
*/

function sendStats (player) {

	const stats = account[auth[player.id]];

	room.sendAnnouncement(`Vitórias: ${stats.wins}, Derrotas: ${stats.defeats}`, player.id);

}

function setStats_teamVictory (scores) {

	let winner, loser;
	const getTeam = id => room.getPlayerList().filter(e => e.team === id);

	if ( scores.red > scores.blue ) { winner = getTeam(1); loser = getTeam(2); }
	else { winner = getTeam(2); loser = getTeam(1); }

	winner.forEach(e => account[auth[e.id]].wins += 1);
	loser.forEach(e => account[auth[e.id]].defeats += 1);

}
