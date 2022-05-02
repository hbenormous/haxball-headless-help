let room = HBInit({});

let
palavras = ["fdp", "porra", "arrombado"],
regex = new RegExp(palavras.join("|"), 'gi');

room.onPlayerChat = (player, message) => {
    if (message.match(regex)) {
        room.sendAnnouncement("Sem xingar.", player.id);
        return false;
    }
}
