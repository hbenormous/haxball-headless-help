(async () => {

	const map = await fetch("https://raw.githubusercontent.com/hbenormous/hbenormous/main/IceBall%20BR.json")//ESTE URL É UM MAPA DE EXEMPLO
	.then(r => r.json()).then(d => JSON.stringify(d))
	.catch(console.error);

	const room = HBInit({});

	room.setCustomStadium(map);

})();
