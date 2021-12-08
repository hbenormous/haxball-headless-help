/*
Autor: aazin#8560
Titulo: Filtro de palavras
Descrição: Filtra as palavras que estão dentro do array e envia uma mensagem.
Data de criação: 08/12/2021

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless
*/

var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

var palavras = ["fdp", "porra", "arrombado"].join('|');
var mensagem = "Sem xingar.";
let regex = new RegExp(`(${palavras})`, 'gi');

room.onPlayerChat = function(player, message) {
    if (message.match(regex)) {
        room.sendAnnouncement(mensagem, player.id);
        return false;
    }
}