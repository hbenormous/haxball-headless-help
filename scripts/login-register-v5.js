let room = HBInit({});

let
prefixString = "!",
AccountsObject = {},
PlayerObject = {},
binIdString = "<BIN_ID>",
apiKeyString = "<API_KEY>";

let Commands = {
	register: (player, password)=>{
		if (AccountsObject[PlayerObject[player.id].conn]) room.sendAnnouncement(`Você já está registrado.`, player.id);
		else {
			if (password == undefined) room.sendAnnouncement(`Você esqueceu de digitar a sua senha.`, player.id);
			else {
				if (password.length < 3) room.sendAnnouncement(`Sua senha deve ter pelo menos três dígitos.`, player.id);
				else {
					AccountsObject[PlayerObject[player.id].conn] = { password: password, confirm: true };
					Request.put();
					room.sendAnnouncement(`Sua senha é (${password})`, player.id);
				}
			}
		}
	},
	login: (player, password)=>{
		if (!AccountsObject[PlayerObject[player.id].conn]) room.sendAnnouncement(`Você não está registrado.`, player.id);
		else {
			if (AccountsObject[PlayerObject[player.id].conn].confirm == true) room.sendAnnouncement(`Você já está logado na sua conta.`, player.id);
			else {
				if (password == undefined) room.sendAnnouncement(`Você esqueceu de digitar a sua senha.`, player.id);
				else {
					if (AccountsObject[PlayerObject[player.id].conn].password != password) room.sendAnnouncement(`Senha errada.`, player.id);
					else {
						AccountsObject[PlayerObject[player.id].conn].confirm = true;
						room.sendAnnouncement(`[${player.id}] ${player.name} confirmou que é ele mesmo.`, null);
					}
				}
			}
		}
	},
	changepass: (player, newPassword)=>{
		if (!AccountsObject[PlayerObject[player.id].conn]) room.sendAnnouncement(`Você não está registrado.`, player.id);
		else {
			if (AccountsObject[PlayerObject[player.id].conn].confirm == false) room.sendAnnouncement(`Confirme sua conta primeiro.`, player.id);
			else {
				if (newPassword == undefined) room.sendAnnouncement(`Você esqueceu de digitar a sua senha.`, player.id);
				else {
					if (newPassword.length < 3) room.sendAnnouncement(`Sua senha deve ter pelo menos três dígitos.`, player.id);
					else {
						AccountsObject[PlayerObject[player.id].conn].password = newPassword;
						room.sendAnnouncement(`Sua nova senha é (${newPassword})`, player.id);
					}
				}
			}
		}
	}
};

let Request = {
	get: ()=>{
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {
			if (xhr.readyState == XMLHttpRequest.DONE) AccountsObject = JSON.parse(xhr.responseText)["record"];
		};

		xhr.open("GET", `https://api.jsonbin.io/v3/b/${binIdString}/latest`, true);
		xhr.setRequestHeader("X-Master-Key", `${apiKeyString}`);
		xhr.send();
	},
	put: ()=>{
		let xhr = new XMLHttpRequest();

		xhr.open("PUT", `https://api.jsonbin.io/v3/b/${binIdString}`, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("X-Master-Key", `${apiKeyString}`);
		xhr.send(JSON.stringify(AccountsObject));
	}
};

Request.get();
delete AccountsObject["key"];

room.onPlayerChat = (player, message) => {
	let messageSplit = message.split(" ");

	if (Object.keys(Commands).map(command=> `${prefixString}${command}`).includes(messageSplit[0].toLowerCase())) {
		Commands[messageSplit[0].slice(1)](player, messageSplit[1]);
		return false;
	}
}

room.onPlayerJoin = player => {
	PlayerObject[player.id] = { conn: player.conn };
}

room.onPlayerLeave = player => {
	if (AccountsObject[PlayerObject[player.id].conn]) {
		AccountsObject[PlayerObject[player.id].conn].confirm = false;
		Request.put();
	}

	delete PlayerObject[player.id];
}
