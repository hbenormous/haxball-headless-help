/**
 * @author aazin#8560
 * @title Sistema de níveis
 * @description  Sistema de níveis de 0 a infinito e mostra o nível quando alguém digita no chat do jogo.
 * @version 1.0
 * @date 24/03/2022
 * @match https://www.haxball.com/headless
 * 
 * @contatos
 * 		Discord: https://discord.gg/UWYuxwEKfn
 * 		Site: https://haxballheadlesshelp.ueuo.com/
 * 		Github: https://github.com/hbenormous/haxball-headless-help
 * 
 * @links
 * 		Haxball Headless Host: https://www.haxball.com/headless
 * 
 * @comandos
 * 		!me
 * 		Observação: Mostra o nível do jogador e xp.
 */

// Definindo função HBInit
var room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

let
PlayerLevel = [],
playerKickBall,
playerGoalXp = 2,
playerOwnGoalXp = 5,
teamVictoryXp = 5,
teamLoserXp = 10,
maxXp = 100;

let LevelSistem = {
	check: {
		level: player=>{
			if (!Object.keys(PlayerLevel).includes(player.name)) LevelSistem.add.playerLevel(player);
		},
		teamVictory: scores=>{
			redTeam = room.getPlayerList().filter(player=> player.team == 1);
			blueTeam = room.getPlayerList().filter(player=> player.team == 2);
			if (scores.red > scores.blue) {
				TeamVictory = redTeam;
				TeamLoser = blueTeam;
			}
			else {
				TeamVictory = blueTeam;
				TeamLoser = redTeam;
			}
			LevelSistem.add.teamVictoryXp(TeamVictory);
			LevelSistem.remove.teamLoserXp(TeamLoser);
		}
	},
	add: {
		level: PGName=>{
			if (PGName.xp >= maxXp) {
				PGName.xp -= maxXp;
				PGName.level += 1;
			}
		},
		playerGoalXp: scores=>{
			const PGName = PlayerLevel[playerKickBall.name];
			if (scores == playerKickBall.team) {
				PGName.xp += playerGoalXp;
				LevelSistem.add.level(PGName);
			}
			else {
				LevelSistem.remove.level(PGName, playerOwnGoalXp);
			}
		},
		teamVictoryXp: TeamVictory=>{
			for(let i = 0; i < TeamVictory.length; i++) {
				PlayerLevel[TeamVictory[i]["name"]].xp += teamVictoryXp;
				LevelSistem.add.level(PlayerLevel[TeamVictory[i]["name"]]);
			}
		},
		playerLevel: player=>{
			PlayerLevel[player.name] =
			{
				level: 0,
				xp: 0
			};
		}
	},
	remove: {
		level: (PGName, type)=>{
			if (PGName.level == 0 && PGName.xp <= 0) {
				PGName.xp = 0;
			}
			else if (PGName.level >= 1) {
				if (PGName.xp < type) {
					PGName.level -= 1;
					PGName.xp = Math.abs(maxXp + PGName.xp - type);
				}
				else {
					PGName.xp -= Math.abs(type);
				}
			}
		},
		teamLoserXp: TeamLoser=>{
			for(let i = 0; i < TeamLoser.length; i++) {
				LevelSistem.remove.level(PlayerLevel[TeamLoser[i]["name"]], teamLoserXp);
			}
		}
	},
	chat: {
		playerChatLevel: (player, message)=>{
			room.sendAnnouncement(`LEVEL ${PlayerLevel[player.name].level} - ${player.name}: ${message}`);
		},
		sendLevel: player=>{
			const PLName = PlayerLevel[player.name];
			room.sendAnnouncement(
				`Level: ${PLName.level}\n`+
				`Xp: ${PLName.xp}`,
				player.id);
		}
	},
};

room.onPlayerBallKick = player => {
	playerKickBall = player;
}

room.onTeamGoal = scores => {
	LevelSistem.add.playerGoalXp(scores);
}

room.onTeamVictory = scores => {
	LevelSistem.check.teamVictory(scores);
}

room.onPlayerJoin = player => {
	LevelSistem.check.level(player);
}

room.onPlayerChat = (player, message) => {
	if (message == "!me") {
		LevelSistem.chat.sendLevel(player);
		return false;
	}
	if (player) {
		LevelSistem.chat.playerChatLevel(player, message);
		return false;
	}
}
