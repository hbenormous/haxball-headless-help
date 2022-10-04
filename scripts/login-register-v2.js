const room = HBInit({});

const accounts = {}; // { playerName: password }
const confirmedPlayerIDs = []; // playerID

room.onPlayerJoin = player => {

    if (accounts[player.name]) {
        room.sendAnnouncement("Faça login na sua conta em 15 segundos.\n" + "!login senha", player.id);

        setTimeout(() => {
            if (!confirmedPlayerIDs.includes(player.id)) room.kickPlayer(player.id, "Faça login na sua conta.", false);
        }, 1000 * 15); // 15 segundos
    } else room.sendAnnouncement("Se registre com o comando: !register senha", player.id);

}

room.onPlayerLeave = player => {

    if (confirmedPlayerIDs.includes(player.id)) confirmedPlayerIDs.splice(confirmedPlayerIDs.indexOf(player.id));

}

room.onPlayerChat = (player, message) => {

    if (message.toLowerCase().substr(0, 10) == "!register ") {
        if (accounts[player.name]) return room.sendAnnouncement("Você já está registrado.", player.id), false;

        accounts[player.name] = message.substr(10); // cria a conta do jogador

        return room.sendAnnouncement("Registrado!\n" + "Senha: " + message.substr(10), player.id), false;
    }

    if (message.toLowerCase().substr(0, 7) == "!login ") {
        if (!accounts[player.name]) return room.sendAnnouncement("Você não está registrado.", player.id), false;
        if (accounts[player.name] !== message.substr(7)) return room.sendAnnouncement("Senha incorreta.", player.id), false;

        if (!confirmedPlayerIDs.includes(player.id)) confirmedPlayerIDs.push(player.id);

        return room.sendAnnouncement(player.name + " confirmou!"), false;
    }

    // DEIXE SEMPRE AQUI EMBAIXO PRA NÃO INTERFERIR EM NADA ACIMA 
    return room.sendAnnouncement(`[${accounts[player.name] ? "✔️" : "❌"}] ${player.name}: ${message}`), false;

}
