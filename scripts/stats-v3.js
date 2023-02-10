/**
 * @COMANDOS
 * 
 * !me
 * Gols: 0 • Assistências: 0 • Gols Contra: 0 • Jogos: 0 • Vitórias: 0 • Derrotas: 0 • Empates: 0 • WR: 0% • Vitórias Consecutivas: 0
 * 
 * !winners
 * Ranking de Vitorias: Posições 1 a 10
 * 1 aazin: 0 ...
 */

const room = HBInit({
	noPlayer: true
});

const CONFIG = {
    ballId: 0, // id do disco principal
    timeLimit: 3,
    drawTime: 3 + 1, // timeLimit + 1 = 4 minutos
    drawIntervalId: null,
    prefix: "!"
};

const PLAYERS = {
    stats: [],
    inRoom: {}
};

class Utils {
    static colors = {
        "yellow": 0xfdff8f,
        "white": 0xffffff,
        "red-hax": 0xE56E56,
        "blue-hax": 0x5689E5
    }

    static sendMessage(msg = "", targetId = null, color = Utils.colors["white"], style = "bold", sound = 2) {
        room.sendAnnouncement(msg, targetId, (Utils.colors[color] || color), style, sound);
    }

    static findPlayerStats(playerId) {
        return PLAYERS.stats.find((player) => player.auth === PLAYERS.inRoom[playerId].auth);
    }

    static getTeamPlayers(teamId) {
        return room.getPlayerList().filter((player) => player.team == teamId);
    }

    static eachTeamPlayers(teamId, callback) {
        return Utils.getTeamPlayers(teamId).forEach(callback);
    }

    static eachPlayersPlaying(callback) {
        return room.getPlayerList().filter((player) => player.team !== 0).forEach(callback);
    }
};

class Stats {
    static touchInBall = {
        beforeTheLast: null,
        last: null
    }

    static goal(teamId) {
        const player = Stats.touchInBall.last;

        if (!player) return;

        if (player.team === teamId) {
            Utils.sendMessage(`Que golaço incrível! ${player.name}#${player.id} acaba de marcar um gol!`, null, (player.team == 1 ? "red-hax" : "blue-hax"));
            Utils.findPlayerStats(player.id).goals += 1;
        }
    }

    static assistance(teamId) {
        const p1 = Stats.touchInBall.last;
        const p2 = Stats.touchInBall.beforeTheLast;

        if (!p2) return;

        if (p1.team === teamId && p1.team === p2.team && p1.id !== p2.id) {
            Utils.sendMessage(`Bom trabalho, ${p2.name}#${p2.id}! Sua assistência foi fundamental para esse gol!`, null, (p2.team == 1 ? "red-hax" : "blue-hax"));
            Utils.findPlayerStats(player.id).assistances += 1;
        }
    }

    static ownGoal(teamId) {
        const player = Stats.touchInBall.last;

        if (!player) return;

        if (player.team !== teamId) {
            Utils.sendMessage(`Ah não, ${player.name}#${player.id} marcou um gol contra!`, null, (player.team == 1 ? "red-hax" : "blue-hax"));
            Utils.findPlayerStats(player.id).ownGoals += 1;
        }
    }

    static game() {
        Utils.eachPlayersPlaying((player) => {
            Utils.findPlayerStats(player.id).games += 1;
        });
    }

    static win(teamId) {
        Utils.sendMessage(`Vitória do time ${teamId == 1 ? "vermelho" : "azul"}.`, null, (teamId == 1 ? "red-hax" : "blue-hax"));

        Utils.eachTeamPlayers(teamId, (player) => {
            Utils.findPlayerStats(player.id).wins += 1;
        });
    }

    static defeat(teamId) {
        Utils.eachTeamPlayers(teamId, (player) => {
            Utils.findPlayerStats(player.id).defeats += 1;
            Utils.findPlayerStats(player.id).winStreak = 0;
        });
    }

    static draw() {
        CONFIG.drawIntervalId = setInterval(() => {

            const scores = room.getScores();

            if (!scores) clearInterval(CONFIG.drawIntervalId);

            if (scores.time >= (CONFIG.drawTime * 60)) {
                clearInterval(CONFIG.drawIntervalId);

                Utils.sendMessage("Sem vencedor nesta partida. Empate!", null, "yellow");

                Utils.eachPlayersPlaying((player) => {
                    const { wins, games } = Utils.findPlayerStats(player.id);

                    Utils.findPlayerStats(player.id).draws += 1;
                    Utils.findPlayerStats(player.id).games += 1;
                    Utils.findPlayerStats(player.id).winRate = Math.round(100 * wins / games);
                    Utils.findPlayerStats(player.id).winStreak = 0;
                });

                room.stopGame();
            }

        }, 1000);
    }

    static winRate() {
        Utils.eachPlayersPlaying((player) => {
            const { wins, games } = Utils.findPlayerStats(player.id);

            Utils.findPlayerStats(player.id).winRate = Math.round(100 * wins / games);
        });
    }

    static winStreak(playerId) {
        Utils.findPlayerStats(player.id).winStreak += 1;
    }

};

class Rank {
    static winners(playerId) {
        const stats = PLAYERS.stats.sort((a, b) => b.wins - a.wins).slice(0, 10);
        const rank = [];

        for (let i = 0; i < stats.length; i++) {
            const { name, wins } = stats[i];
            rank.push(`${i+1} ${name}: ${wins}`);
        }

        Utils.sendMessage(`Ranking de Vitorias: Posições 1 a 10\n${rank.join(" \u2022 ")}`, playerId, "yellow", "small-bold");
    }
};

class PlayerStats {
    constructor(params) {
        this.auth = params.auth;
        this.name = params.name;

        this.goals = params.goals || 0;
        this.assistances = params.assistances || 0;
        this.ownGoals = params.ownGoals || 0;
        this.games = params.games || 0;
        this.wins = params.wins || 0;
        this.defeats = params.defeats || 0;
        this.draws = params.draws || 0;
        this.winRate = params.winRate || 0;
        this.winStreak = params.winStreak || 0;
    }
};

room.setTimeLimit(CONFIG.timeLimit);

room.onPlayerChat = (player, message) => {

    if (message[0] === CONFIG.prefix) {
        if (message === (CONFIG.prefix + "me")) {
            const { goals, assistances, ownGoals, games, wins, defeats, draws, winRate, winStreak } = Utils.findPlayerStats(player.id);

            const stats = [
                `Gols: ${goals}`,
                `Assistências: ${assistances}`,
                `Gols Contra: ${ownGoals}`,
                `Jogos: ${games}`,
                `Vitórias: ${wins}`,
                `Derrotas: ${defeats}`,
                `Empates: ${draws}`,
                `WR: ${winRate}%`,
                `Vitórias Consecutivas: ${winStreak}`
            ].join(" \u2022 ");

            Utils.sendMessage(stats, player.id, "white", "small-bold");
        } else if (message === "!winners") {
            Rank.winners(player.id);
        }

        return false;
    }

};

room.onPlayerJoin = (player) => {

    PLAYERS.inRoom[player.id] = player;

    if (!PLAYERS.stats.find(p => p.auth === player.auth)) {
        PLAYERS.stats.push(new PlayerStats({ auth: player.auth, name: player.name }));
    } else {
        Utils.findPlayerStats(player.id).name = player.name;
    }

};

room.onPlayerLeave = (player) => {

    delete PLAYERS.inRoom[player.id];

    if (Stats.touchInBall.last) {
        if (Stats.touchInBall.last.id === player.id) Stats.touchInBall.last = null;
    }
    if (Stats.touchInBall.beforeTheLast) {
        if (Stats.touchInBall.beforeTheLast.id === player.id) Stats.touchInBall.beforeTheLast = null;
    }

};

room.onGameStart = (byPlayer) => {

    Stats.draw();

};

room.onGameStop = (byPlayer) => {

    clearInterval(CONFIG.drawIntervalId);
    Stats.touchInBall.last = null;
    Stats.touchInBall.beforeTheLast = null;

};

room.onPlayerBallKick = (player) => {

    Stats.touchInBall.beforeTheLast = Stats.touchInBall.last;
    Stats.touchInBall.last = player;

};

room.onTeamGoal = (teamId) => {

    Stats.goal(teamId);
    Stats.assistance(teamId);
    Stats.ownGoal(teamId);

};

room.onTeamVictory = (scores) => {

    Stats.game();

    if (scores.red > scores.blue) {
        Stats.win(1);
        Stats.defeat(2);
    } else {
        Stats.win(2);
        Stats.defeat(1);
    }

    Stats.winRate();

};

room.onGameTick = () => {

    Utils.eachPlayersPlaying(player => {

        const pdp = room.getPlayerDiscProperties(player.id);
        const ball = room.getDiscProperties(CONFIG.ballId);
        const distance = (x1, y1, x2, y2) => {
            return Math.hypot(x2 - x1, y2 - y1);
        };

        if (distance(pdp.x, pdp.y, ball.x, ball.y) < (pdp.radius + ball.radius + 0.01)) {
            Stats.touchInBall.beforeTheLast = Stats.touchInBall.last;
            Stats.touchInBall.last = player;
        }

    });

};
