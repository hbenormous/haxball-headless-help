/*
Autor: aazin#8560
Titulo: Webhook tutorial
Descrição: Tutorial de como construir um webhook no haxball.
Data de criação: 24/11/2021

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Como criar webhook: https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks
    Haxball Headless Host: https://www.haxball.com/headless
*/

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

// Globais
// https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks
var webhookURL = "https://discord.com/api/webhooks/903822016916893758/DYLVgDBfYWpIyFo5RGzuH4fSvGL9n8GbaNs-0RNWIFazjlsT6M7U7383w_3aQ_je08lb"; // Webhook link
var webhookNOME = '.'; // Webwook nome

// Funções
function discord(mensagem) {
var chamar = new XMLHttpRequest();
    chamar.open("POST",webhookURL); // Webhook Link
    chamar.setRequestHeader('Content-type', 'application/json');

    var weebhook_dados = {
        username: webhookNOME, // Nome do webhook
        content: mensagem // Callback
    };

    chamar.send(JSON.stringify(weebhook_dados));
}


// on
room.onPlayerChat = function(player, message) {
    discord(player.name + ': ' + message); // Exemplo de webhook
}
