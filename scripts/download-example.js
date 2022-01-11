/*
Autor: aazin#8560
Titulo: Download example
Descrição: Exemplo de como fazer download de algo.
Data de criação: 02/01/2022

Contatos:
    Discord: https://discord.gg/UWYuxwEKfn
    Site: https://haxballheadlesshelp.ueuo.com/
    Github: https://github.com/hbenormous/haxball-headless-help

Links:
    Haxball Headless Host: https://www.haxball.com/headless

Comandos:
	!download
	Observação: Baixe o que quiser.
*/

// Definindo função HBInit
var room = HBInit({
    roomName: 'Haxball Headless Help',
    maxPlayers: 10,
    public: true,
    noPlayer: true
});

function download(conteudo, nomeDoArquivo, tipoDeArquivo) {
	let blob = new Blob([conteudo], { type: tipoDeArquivo });
	const link = window.document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = nomeDoArquivo;
	link.click();
	window.URL.revokeObjectURL(link.href);
}

room.onPlayerChat = (player, message) => {
	if (message == "!download") {
		// Argumento 1: Conteúdo a ser baixado.
		// Argumento 2: Nome do arquivo + formato.
		// Argumento 3: Tipo de conteúdo.
		download(`${player.name}: ${message}`, "mensagem.txt", "text/plain;charset=utf-8;");
	}
}