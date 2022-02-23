/**
 * @author aazin#8560
 * @title Kick player com o mesmo nick
 * @description  Kick o jogador que entrar na sala usando qualquer nome que já esteja sendo usado na sala.
 * @version 1.0
 * @date 23/02/2022
 * @match https://www.haxball.com/headless
 * 
 * @contatos
 *      Discord: https://discord.gg/UWYuxwEKfn
 *      Site: https://haxballheadlesshelp.ueuo.com/
 *      Github: https://github.com/hbenormous/haxball-headless-help
 * 
 * @links
 *      Haxball Headless Host: https://www.haxball.com/headless
 * 
 * @snippets
 */

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true /* noPlayer tem que ser = true. */
});

function kickPlayer(player){
    players = room.getPlayerList(); // Puxa a lista de players em Object.
    for (i = 0; i < players.length-1; i++){ // Faz um for loop.
        // Verifique o nome do jogador que acabou de entrar na sala.
        if (player.name == players[i].name) room.kickPlayer(player.id, "Alguém já está usando esse nick.", false); // Se o nome já estiver sendo usado, ele kick o jogador.
    }
}

room.onPlayerJoin = (player) => {
    kickPlayer(player);
}