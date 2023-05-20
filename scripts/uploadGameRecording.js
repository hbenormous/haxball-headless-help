class App {
    static sendMessage(message, type) {
        const messageType = {
            success: 0x49A835,
            warn: 0xEDD400,
            error: 0xEE333B,
            default: 0xFFFFFF
        }[type.toLowerCase()];

        room.sendAnnouncement(message, null, messageType, "bold");
    }

    static uploadRecToServer(rec) {
        const file = new File([rec], "file.hbr2");

        if (file.size > 500000) {
            App.sendMessage("Error: File size exceeds upload limit of 500kb", "error");
            return;
        }

        App.sendMessage("Uploading...", "warn");

        const formData = new FormData();
        formData.append("file", file);

        fetch("https://corsproxy.io/?https://hax.saviola.de/r/upload.php", {
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
        if (data.status === 0) {
            App.sendMessage(`Error: ${data.message}`, "error");
        } else {
            const url = data.message;

            App.sendMessage("Upload complete", "success");
            // App.sendMessage("Download: " + url + ".hbr2", "default");
            App.sendMessage("Watch: " + url, "default");
        }
    }
}

const room = HBInit({});

room.onGameStart = () => {
    room.startRecording();
};

room.onGameStop = () => {
    App.uploadRecToServer(room.stopRecording());
};