const webhookURL = "your webhook url";

let lastScores = {};

const roomName = "Haxball Headless Help";
const room = HBInit({
    roomName: roomName
});

room.onGameStart = byPlayer => {

    room.sendAnnouncement("A partida está sendo gravada.");
    room.startRecording();

}

room.onGameStop = byPlayer => {

    if (byPlayer.id !== 0) {
        room.sendAnnouncement("A gravação da partida foi enviada para o discord.");
        sendRec();
    }

}

room.onTeamVictory = scores => {

    room.sendAnnouncement("A gravação da partida foi enviada para o discord.");
    sendRec();

}

room.onGameTick = () => lastScores = room.getScores();

function sendRec() {

    if (!lastScores) return;

    post(webhookURL, setForm());

}

function setForm() {

    const customDate = () => {
        const date = new Date().toLocaleDateString().split("/").join("-");
        const time = new Date().toLocaleTimeString().split(":");

        return `${date}-${time[0]}h${time[1]}m`;
    };

    const rec = room.stopRecording();
    const fileName = "HBReplay-" + customDate() + ".hbr2";
    const format = {
        "type": "text/plain"
    };

    const scores = lastScores;

    const getTeamList = id => {
        const team = room.getPlayerList().filter(player => player.team == id).map(player => player.name);
        return team.length ? team.join("\n") : "\u3164";
    };
    const customTime = time => ~~(Math.trunc(time) / 60) + ":" + (Math.trunc(time) % 60).toString().padEnd(2, "0");

    const form = new FormData();
    form.append("file", new File(rec, fileName, format));
    form.append("payload_json", JSON.stringify({
        "username": "game stats",
        "avatar_url": "https://iconape.com/wp-content/files/yd/367702/svg/stats-logo-icon-png-svg.png",
        "content": "",
        "embeds": [{
            "color": 2078513,
            "author": {
                "name": roomName
            },
            "footer": {
                "text": fileName.slice(0, fileName.length - 5),
                "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/ORCID_iD.svg/2048px-ORCID_iD.svg.png"
            },
            "fields": [{
                "name": `Red (${scores.red} goals)`,
                "value": getTeamList(1),
                "inline": true
            }, {
                "name": `Blue (${scores.blue} goals)`,
                "value": getTeamList(2),
                "inline": true
            }, {
                "name": "Time",
                "value": customTime(scores.time)
            }, {
                "name": "Time Limit",
                "value": customTime(scores.timeLimit)
            }, {
                "name": "Score Limit",
                "value": scores.scoreLimit
            }]
        }]
    }));

    return form;

}

function post(url, params) {

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.send(params);

}