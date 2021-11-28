/*
Autor: aazin#8560
Titulo: Stats script
Descrição: Script sobre como construir estatísticas básicas com vitórias e derrotas no haxball.
Data de criação: 28/11/2021

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless
*/

// Definindo função HBInit.
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

// Variáveis globais.
var _usuarios = [];
var _time_blue = [];
var _time_red = [];
var _time_spect = [];
var stats = {};

// Função para enviar uma mensagem com estatísticas.
function _enviar_stats(player){
    room.sendAnnouncement("Vitórias: "+ stats[player['name']].vitorias + ", Derrotas: " + stats[player['name']].derrotas, player.id);
}

// on.
room.onPlayerJoin = function(player) {
    // Definindo os stats.
    if (_usuarios.includes(player.name)) {
        room.sendAnnouncement('Digite !me', player.id);
    }
    else {
        stats[player.name] = {}
        stats[player.name].vitorias = 0;
        stats[player.name].derrotas = 0;
        _usuarios.push(player.name);
        room.sendAnnouncement('Digite !me', player.id);
    }
}

room.onTeamVictory = function(scores) {

    // Definindo os times.
    _time_spect = room.getPlayerList().filter((player) => player.team == 0 );
    _time_blue = room.getPlayerList().filter((player) => player.team == 2 );
    _time_red = room.getPlayerList().filter((player) => player.team == 1 );
    var i;
    
    if (scores.red > scores.blue){
        var vencedor = _time_red;
        var perdedor = _time_blue;
    }
    else{
        var vencedor = _time_blue;
        var perdedor = _time_red;
    }
    for (i = 0; i < perdedor.length; i++) { // Adiciona uma derrota às suas estatísticas.
        stats[perdedor[i]['name']].derrotas += 1;

    }
    for (i = 0; i < vencedor.length; i++) { // Adiciona uma vitória às suas estatísticas.
        stats[vencedor[i]['name']].vitorias += 1;
    }
}

room.onPlayerChat = function(player, message) {
    if (message == "!me"){ // Comando para visualizar estatísticas.
        _enviar_stats(player);
        return false;
    }
}
