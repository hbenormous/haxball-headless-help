/**
 * @author aazin#8560
 * @title Enviar gravação via webhook
 * @description  Sistema para enviar uma gravação do Haxball via webhook + enviar personalização.
 * @version 1.0
 * @date 02/02/2022
 * @match https://www.haxball.com/headless
 * 
 * @contatos
 *      Discord: https://discord.gg/UWYuxwEKfn
 *      Site: https://haxballheadlesshelp.ueuo.com/
 *      Github: https://github.com/hbenormous/haxball-headless-help
 * 
 * @links
 *      Haxball Headless Host: https://www.haxball.com/headless
 *      Como criar webhook: https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks
 */

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

/*
Como criar um webhook?
link: https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks
*/

// Link do webhook.
const webhookURL = "seu link do webhook";

// Enviar data (opcional)
function getDate(){
    let data = new Date(),
    dia=data.getDate().toString().padStart(2, '0'),
    mes=(data.getMonth()+1).toString().padStart(2, '0'),
    ano=data.getFullYear(),
    horas=data.getHours().toString().padStart(2, '0'),
    minutos=data.getMinutes().toString().padStart(2, '0');
    return `${dia}-${mes}-${ano}-${horas}h${minutos}m`;
}

// Enviar tempo (opcional)
function getScoresObjectTime(scores) {
    return Math.floor(Math.floor(scores/60)/10).toString()+Math.floor(Math.floor(scores/60)%10).toString()+":"+Math.floor(Math.floor(scores-(Math.floor(scores/60)*60))/10).toString()+Math.floor(Math.floor(scores-(Math.floor(scores/60)*60))%10).toString();
}

// Envie players da equipe vermelha e azul (opcional)
function getPlayersStats(scores){
    red = room.getPlayerList().filter((player)=>player.team==1);
    blue = room.getPlayerList().filter((player)=>player.team==2);
    printRed = red.map((player)=>{return player.name});
    printBlue = blue.map((player)=>{return player.name});
    getGameStats = [
    `${printRed} **${scores.red}-${scores.blue}** ${printBlue}\n`+
    `timer: ${getScoresObjectTime(scores.time)}\n`+
    `scoreLimit: ${scores.scoreLimit}\n`+
    `timeLimit: ${getScoresObjectTime(scores.timeLimit)}`
    ];
    return getGameStats;
}

function sendDiscordWebhook(scores){
    const form = new FormData();
    // Você pode fazer upload de até 8 MB de arquivo via webhook.
    // Argumento
    // Execução [ operação, nome, tipo ]
    form.append(
        "arquivo",
        new File([room.stopRecording()],
            `HBReplay-${getDate()}.hbr2`,
            {type: "text/plain"}
            )
        );

    // (opcional)
    form.append("content", getPlayersStats(scores));

    // Enviar via webhook.
    const webhook = new XMLHttpRequest();
    webhook.open("POST", webhookURL);
    webhook.send(form);
}

room.onGameStart=(byPlayer)=>{
    room.sendAnnouncement("A partida está sendo gravada.");
    room.startRecording();
}

room.onTeamVictory=(scores)=>{
    sendDiscordWebhook(scores);
    room.sendAnnouncement("A gravação da partida foi enviada para o discord.");
}