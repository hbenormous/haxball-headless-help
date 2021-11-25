/*
Autor: aazin#8560
Titulo: Webhook tutorial
Descrição: Tutorial de como construir um webhook no haxball.
Data de criação: 12:56PM

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
var webhookURL = "URL da webhook" // https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks


// Funções
function discord(mensagem) {
var chamar = new XMLHttpRequest();
    chamar.open("POST",webhookURL);
    chamar.setRequestHeader('Content-type', 'application/json');

    var weebhook_dados = {
        username: 'nome', // Nome do webhook
        content: mensagem // Callback
    };

    chamar.send(JSON.stringify(weebhook_dados));
}


// on
room.onPlayerChat = function(player, message) {
    discord(player.name + ': ' + message); // Exemplo de webhook
}