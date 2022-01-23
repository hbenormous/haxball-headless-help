/*
Autor: aazin#8560
Titulo: Comando Login e Registro + LocalStorage
Descrição: Contém algumas partes da v3 + adaptadas com localStorage.
Data de criação: 23/01/2022

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless

Comandos:
  !register password
  Observação: Digite sua senha para se registrar na sala.
  Exemplo: !register 12345

  !login password
  Observação: Digite sua senha para entrar em sua conta.
  Exemplo: !login 12345
*/

// Definindo função HBInit
var room = HBInit({
  roomName: 'Haxball Headless Help',
  maxPlayers: 10,
  public: true,
  noPlayer: true
});

var registro = new Map();
const css = "border:2px solid;padding:8px;background:";

// Funções dos comandos.
function setRegister(player, senha) {
  if (registro.get(player.name)) room.sendAnnouncement('Você já está registrado.', player.id);
  else {
    registro.set(player.name, senha);
    localStorage.setItem("registros", JSON.stringify([...registro]));
    room.sendAnnouncement('Registrado!', player.id);
    room.sendAnnouncement(`Senha: ${senha}`, player.id);
  }
}

function getLogin(player, senha) {
  if (registro.get(player.name)) {
    if (registro.get(player.name) == senha) {
      room.sendAnnouncement(`${player.name} confirmou!`, null);
    }
    else room.sendAnnouncement('Senha incorreta.', player.id);
  }
  else room.sendAnnouncement('Você não está registrado.', player.id);
}

// HBInit functions.
room.onPlayerJoin=(player)=>{
  if (registro.get(player.name)) room.sendAnnouncement('!login senha', player.id);
  else room.sendAnnouncement('Se registre com o comando: !register senha', player.id);
}

room.onPlayerChat=(player, message)=>{
  // !register password
  if (message.toLowerCase().substr(0,10) == '!register ') {
    setRegister(player, message.substr(10));
    return false;
  }

  // !login password
  if (message.toLowerCase().substr(0,7) == '!login ') {
    getLogin(player, message.substr(7));
    return false;
  }

  // Mensagem customizada para players registrados e não registrados.
  if (registro.get(player.name)) {
    room.sendAnnouncement(`✔️  ${player.name}: ${message}`, null);
    return false;
  }
  else {
    room.sendAnnouncement(`❌  ${player.name}: ${message}`, null);
    return false;
  }
}

room.onRoomLink=(link)=>{
  if (localStorage.getItem("registros")==null) console.error(`%c\u2716 localStorage [ registros ]`, css+"#FF0000;color: white;");
  else {
    registro=new Map(JSON.parse(localStorage.registros));
    console.log(`%c\u2714 localStorage [ registros ]`, css+"#00FF00;");
  }
}