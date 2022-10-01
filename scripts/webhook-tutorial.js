/**
 * TUTORIAL
 * https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks
 */
 const URLs = {
    chat: "SUA URL DO WEBHOOK"
};

const room = HBInit({});

room.onPlayerChat = (player, message) => {

    sendMessageToDiscord(URLs.chat, {
        content: `${player.name}: ${message}`
    });

}

function sendMessageToDiscord(url, params = {}) {

    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();

        xhr.open("POST", url);

        xhr.setRequestHeader("Content-Type", "application/json"); // formato json

        /**
         * DISCORD WEBHOOK PARAMS
         * https://birdie0.github.io/discord-webhooks-guide/index.html
         */
        xhr.send(JSON.stringify(params));

    });

}