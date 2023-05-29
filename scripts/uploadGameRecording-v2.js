class App {
    static urls = {
        watch: "https://haxtube.com/replay/",
        download: "https://cdn.haxtube.com/replays/",
        upload: "https://corsproxy.io/?https://haxtube.com/api/v1/replays/"
    };

    static sendMessage(message, type) {
        const messageType = {
            success: 0x49A835,
            warn: 0xEDD400,
            error: 0xEE333B,
            default: 0xFFFFFF
        }[type.toLowerCase()];

        room.sendAnnouncement(message, null, messageType, "bold");
    }

    static getCustomDate() {
        const date = new Date().toLocaleDateString().split("/").join("-");
        const time = new Date().toLocaleTimeString().split(":");

        return `${date}-${time[0]}h${time[1]}m`;
    }

    static uploadRecToServer(rec) {
        const file = new File([rec], "file.hbr2");

        if (file.size > 500000) {
            App.sendMessage("Error: File size exceeds upload limit of 500kb", "error");
            return;
        }

        App.sendMessage("Uploading...", "warn");

        const formData = new FormData();
        formData.append("replay", file);
        formData.append("title", `${roomConfig.roomName}-${App.getCustomDate()}`);
        formData.append("description", "Minha descrição.");
        formData.append("tags", ["tag"]); /* ['tag1', 'tag2', 'tag3'] */

        fetch(App.urls.upload, {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => App.handleUploadResponse(data))
        .catch(error => {
            App.sendMessage(`Error: ${error.name} ${error.message}`, "error");
        });
    }

    static handleUploadResponse(data) {
        if (data.status === "fail") {
            App.sendMessage(`Error: ${data.message}`, "error");
        } else {
            const urls = {
                watch: App.urls.watch + data.data.slug,
                download: App.urls.download + data.data.file
            };

            App.sendMessage("Upload complete", "success");
            // App.sendMessage("Download: " + urls.download, "default");
            App.sendMessage("Watch: " + urls.watch, "default");
        }
    }
}

const roomConfig = {
    roomName: "Haxball Headless Help"
};
const room = HBInit(roomConfig);

room.onGameStart = () => {
    room.startRecording();
};

room.onGameStop = () => {
    App.uploadRecToServer(room.stopRecording());
};