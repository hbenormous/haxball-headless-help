/**
 * @author aazin#8560
 * @title Mover os jogadores automáticamente
 * @description  Sistema para mover automaticamente os jogadores em uma partida.
 * @version 1.0
 * @date 16/02/2022
 * @match https://www.haxball.com/headless
 * 
 * @contatos
 *      Discord: https://discord.gg/UWYuxwEKfn
 *      Site: https://haxballheadlesshelp.ueuo.com/
 *      Github: https://github.com/hbenormous/haxball-headless-help
 * 
 * @links
 *      Haxball Headless Host: https://www.haxball.com/headless
 */

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true /* noPlayer tem que ser = true. */
});

room.setTeamsLock(true);

let players = 2; // Máximo de players por time.

function teams() {
	red = room.getPlayerList().filter((player)=>player.team==1); // Filtra jogadores da equipe vermelha.
	blue = room.getPlayerList().filter((player)=>player.team==2); // Filtra jogadores da equipe azul.
	spect = room.getPlayerList().filter((player)=>player.team==0); // Filtrar jogadores da equipe espectadores.
}

let move = {
	playerLoser: (scores)=>{ // Mova os jogadores que perderam a partida para o spect.
		teams();
		if (scores.red > scores.blue) { // Se os pontos do time vermelho forem maiores que os do time azul, ele realiza a ação.
			room.stopGame();
			blue.map((player)=> room.setPlayerTeam(player.id, 0));
			move.spectPlayer({ team: 2 });
		}
		else { // Se os pontos do time azul forem maiores que os do time vermelho, ele realiza a ação.
			room.stopGame();
			red.map((player)=> room.setPlayerTeam(player.id, 0));
			move.spectPlayer({ team: 1 });
		}
	},
	spectPlayer: (object)=>{ // Filtre os jogadores espectadores para o time vermelho ou azul.
		teams();
		if (object.team==1) { // { team: 1 } = red
			setTimeout(()=>{
				spect.slice(0, players).map((player)=> room.setPlayerTeam(player.id, 1));
				room.startGame();
			},3000);
		}
		if (object.team==2) { // { team: 2 } = blue
			setTimeout(()=>{
				spect.slice(0, players).map((player)=> room.setPlayerTeam(player.id, 2));
				room.startGame();
			},3000);
		}
	},
	playerJoin: (player)=>{ // Mova os jogadores que entram na sala.
		teams();
		if (blue.length > red.length) { // Se o número de jogadores do time azul for maior que o do time vermelho, ele move o jogador para o time vermelho.
			room.setPlayerTeam(player.id, 1);
		}
		else if (blue.length < players) { // Se o número de jogadores do time azul for menor que {players}, ele move o jogador para o time azul.
			room.setPlayerTeam(player.id, 2);
		}
		if (red.length > blue.length) {
			room.setPlayerTeam(player.id, 2);
		}
		else if (red.length < players) {
			room.setPlayerTeam(player.id, 1);
		}
	},
	checkTeams: ()=>{ // Confira os jogadores de cada equipe.
		teams();
		if (spect.length >= 1) { // Verifica se há jogadores no espectador, se houver.
			if (red.length < players) { // Ele verifica se o time vermelho é menor que {players}.
				room.setPlayerTeam(spect[0].id, 1);
			}
			else if (blue.length < players) { // Caso contrário verifica se o time azul é menor que {players}.
				room.setPlayerTeam(spect[0].id, 2);
			}
		}
		else if (spect.length == 0) { // Se não houver um jogador espectador, ele inicia o jogo.
			room.startGame();
		}
	}
};

room.onTeamVictory = (scores) => {
	move.playerLoser(scores);
}

room.onPlayerLeave = (player) => {
	move.checkTeams();
}

room.onPlayerJoin = (player) => {
	move.playerJoin(player);
}

room.onPlayerTeamChange = (changedPlayer, byPlayer) => {
	teams();
	if (red.length <= players && blue.length <= players) { // Se o número de jogadores do time azul e vermelho for menor que {players}, o jogo começa.
		setTimeout(()=>{
			room.startGame();
		},3000);
	}
	if (red.length == players && blue.length == players) { // Se o número de jogadores no time azul e vermelho for igual a {players}, o jogo reinicia.
		room.stopGame();
		room.startGame();
	}
}