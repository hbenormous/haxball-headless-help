let
roomNameString = "Haxball Headless Help",
room = HBInit({
    roomName: roomNameString,
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

let webhookURL = `sua url do webhook`;

let RecSistem = {
    getCustomDate: ()=>{
        let
        data = new Date().toLocaleDateString().split("/").join("-"),
        relogio = new Date().toLocaleTimeString().split(":");

        return `${data}-${relogio[0]}h${relogio[1]}m`;
    },
    getScoresTime: time=>{
        return ~~(Math.trunc(time) / 60) + ":" + (Math.trunc(time)%60).toString().padStart(2, '0');
    },
    sendDiscordWebhook: scores=>{
        let
        red = room.getPlayerList().filter((player)=>player.team == 1).map((player)=> player.name),
        blue = room.getPlayerList().filter((player)=>player.team == 2).map((player)=> player.name);

        let form = new FormData();
        form.append(null, new File( [room.stopRecording()], `HBReplay-${RecSistem.getCustomDate()}.hbr2`, {"type": "text/plain"} ));
        form.append("payload_json", JSON.stringify(RecSistem.getParams(scores, red, blue)));

        let xhr = new XMLHttpRequest();
        xhr.open("POST", webhookURL);
        xhr.send(form);
    },
    getParams: (scores, red, blue)=>{
        let params = {
          "username": "game stats",
          "avatar_url": "https://iconape.com/wp-content/files/yd/367702/svg/stats-logo-icon-png-svg.png",
          "content": "",
          "embeds": [{
            "title": "",
            "color": 2078513,
            "description": "",
            "timestamp": null,
            "author": { "name": roomNameString },
            "image": {},
            "thumbnail": {},
            "footer": {
                "text": `HBReplay-${RecSistem.getCustomDate()}`,
                "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/ORCID_iD.svg/2048px-ORCID_iD.svg.png"
            },
            "fields": [
            { "name": "RED", "value": `${red.join("\n")}\n**GOLS**\n${scores.red}`, "inline": true },
            { "name": "BLUE", "value": `${blue.join("\n")}\n**GOLS**\n${scores.blue}`, "inline": true },
            { "name": "TEMPO", "value": RecSistem.getScoresTime(scores.time) },
            { "name": "LIMITE DE TEMPO", "value": RecSistem.getScoresTime(scores.timeLimit) },
            { "name": "LIMITE DE GOLS", "value": scores.scoreLimit }
            ]
        }],
        "components": []
    };
    return params;
}
};

room.onGameStart = byPlayer => {
    room.sendAnnouncement("A partida está sendo gravada.");
    room.startRecording();
}

room.onTeamVictory = scores => {
    RecSistem.sendDiscordWebhook(scores);
    room.sendAnnouncement("A gravação da partida foi enviada para o discord.");
}