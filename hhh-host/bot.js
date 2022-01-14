// https://www.haxball.com/headlesstoken
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true,
    token: "thr1.AAAAAGHg3jLBgIaeCbPSxw.RtADNrhJAPI"
});

function updateAdmins() { 
  var players = room.getPlayerList();
  if ( players.length == 0 ) return;
  if ( players.find((player) => player.admin) != null ) return;
  room.setPlayerAdmin(players[0].id, true);
}

room.onPlayerJoin=(player)=>{
  updateAdmins();
}

room.onPlayerLeave=(player)=>{
  updateAdmins();
}