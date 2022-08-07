const room = HBInit({});

room.onPlayerLeave = player => {

	if ( player.team !== 0 ) {
		const
		myTeam = player.team===1?"red":"blue",
		adversary = player.team!==1?"red":"blue",
		scores = room.getScores();

		if ( scores !== null && scores[myTeam] < scores[adversary] ) room.sendAnnouncement(`${player.name} saiu da sala(rage quit).`, null);
	}

}
