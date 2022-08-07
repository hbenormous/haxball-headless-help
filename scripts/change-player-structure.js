const room = HBInit({});

room.onTeamGoal = team => {

	room.getPlayerList().forEach(async player => {

		if ( team === player.team ) {
			room.setPlayerAvatar(player.id, "\u26BD");
			room.setPlayerDiscProperties(player.id, {radius: room.getPlayerDiscProperties(player.id).radius*2});
		}
		else room.setPlayerAvatar(player.id, "\u2716");

		await new Promise(r => setTimeout(r, 3000));

		room.setPlayerAvatar(player.id, null);
		if ( team === player.id ) room.setPlayerDiscProperties(player.id, {radius: room.getPlayerDiscProperties(player.id).radius});

	});

}
