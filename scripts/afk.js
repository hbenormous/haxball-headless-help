var room = HBInit({
	roomName: 'Haxball Headless Help',
	maxPlayers: 10,
	public: true,
	noPlayer: true
});

let COR = {
    RED: 0xFA5646,
    GREEN: 0x7DFA89,
    YELLOW: 0xFFF22A
};

var afks = [];

room.onPlayerChat = function(player, message) {
if (message == '!afk') {
if (afks.includes(player.name)) {
afks.splice(afks.indexOf(player.name), 1);
room.sendAnnouncement(player.name + " ficou disponível.", null, COR.GREEN, "bold", 2);
} else {
room.sendAnnouncement(player.name + " ficou afk.", null, COR.GREEN, "bold", 2);
if (player.team != 0) room.setPlayerTeam(player.id, 0);
afks.push(player.name);
}
return false;
}
if (message == '!afks') {
  room.sendAnnouncement("--------------------------------------------------------------------------", player.id, COR.RED, "bold", 0);
  room.sendAnnouncement("Jogadores afks:  " + afks.join(', '), player.id, COR.GREEN, "bold", 2);
  room.sendAnnouncement("Quantidade: " + afks.length, player.id, COR.GREEN, "bold", 2);
  room.sendAnnouncement("--------------------------------------------------------------------------", player.id, COR.RED, "bold", 0);
  return false;
}
}

room.onPlayerTeamChange = (changedPlayer, byPlayer) => {

if (afks.includes(changedPlayer.name)) {
  room.setPlayerTeam(changedPlayer.id, 0);
  if (byPlayer) room.sendAnnouncement(changedPlayer.name + " está afk e não pode ser movido.", null, COR.YELLOW, "bold", 2);
}
}