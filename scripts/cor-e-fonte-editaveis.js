/**
 * o script foi baseado no link abaixo
 * SCRIPT ORIGINAL: https://gist.github.com/hbenormous/fb0734dd754d59b85acdf4a1463e9d1c
 * 
 * COMANDOS:
 * !color hexadecimal_color
 * !font haxball_fonts
 */

function Player(obj) {

    this.auth = obj.auth || null;
    this.color = obj.color || 0xffffff;
    this.font = obj.font || "normal";

}

const allowedPlayerAuths = ["puxe pra essa array o auth dos jogadores que podem usar os comandos"]; // PlayerObject.auth
const playerColors = []; // : Player
const playerAuths = {}; // { playerID: playerAuth }

const room = HBInit({});

room.onPlayerJoin = player => {

    checkList(player);

    playerAuths[player.id] = player.auth;

}

room.onPlayerLeave = player => delete playerAuths[player.id];

room.onPlayerChat = (player, message) => {

    if (message.startsWith("!") && allowedPlayerAuths.includes(playerAuths[player.id])) return handleCommands(player, message), false;

    return handleChatColorAndFont(player, message), false;

}

function handleCommands(player, message) {

    const sendConfirm = id => room.sendAnnouncement("\u2714", id);

    const messages = message.split(" ");

    if (message.startsWith("!color") && messages[1]) {
        const isHex = str => {
            return Boolean(str.match(/^0x[0-9a-f]+$/i));
        };

        const color = "0x" + messages[1];

        if (isHex(color) === false) return room.sendAnnouncement("Cor inexistente.\nhttps://encycolorpedia.pt/", player.id);

        getPlayer(player.id).color = color;
        sendConfirm(player.id);

    } else if (message.startsWith("!font") && messages[1]) {
        const fonts = ["normal", "bold", "italic", "small", "small-bold", "small-italic"];
        const font = messages[1].toLowerCase();

        if (!fonts.includes(font)) return room.sendAnnouncement(`Essa não e uma fonte fornecida pela API.\nFontes: ${fonts.join(", ")}`);

        getPlayer(player.id).font = font;
        sendConfirm(player.id);
    }

}

function handleChatColorAndFont(player, message) {

    const {
        color,
        font
    } = getPlayer(player.id);

    room.sendAnnouncement(`${player.name}: ${message}`, null, color, font);

}

function getPlayer(id) {
    return playerColors.find(p => p.auth === playerAuths[id]);
}

function checkList(player) {
    if (!getPlayer(player.id)) playerColors.push(new Player({
        auth: player.auth
    }));
}
