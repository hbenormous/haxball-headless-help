/**
 * @param {int}        number                      Número que será representado.
 * @param {array<int>} [discIds=[]]                Id dos Discos.
 * @param {number}     [space=10]                  Espaçamento Entre Cada Disco.
 * @param {int}        [size=10]                   Tamanho dos Discos.
 * @param {object}     [position={"x": 0, "y": 0}] Coordenadas para posicionamento do bloco com os discos.
 * 
 * @note
 * O maior número que pode ser criado com 13 discos é o 8.
 * Quanto maior o numero do primeiro argumento maior sera a quantidade de discos usadas
 * 
 * Como usar:
 * generateNumbersWithDiscs( 1, [0, 1, 2, 3, 4, 5, 6, 7], 50, 60, { x : 20, y : -12 } )
 */
function generateNumbersWithDiscs(number, discIds = [], space = 10, size = 10, numberPosition = {x: 0, y: 0 }) {
    const { x, y } = numberPosition;

    // Cria uma matriz de posições para cada dígito
    let digitPositions = [];
    let digit = number;
    while (digit > 0) {
        let digitMatrix = getDigitMatrix(digit % 10);
        digitPositions.unshift(digitMatrix);
        digit = Math.floor(digit / 10);
    }

    let discCounter = 0;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < digitPositions.length; j++) {
            for (let k = 0; k < 3; k++) {
                if (digitPositions[j][i][k]) {
                    const spaceBetweenTheNumbers = 2;
                    let xCoord = x + j * spaceBetweenTheNumbers * (space * 4) + (k === 0 ? -space * 2 : k === 2 ? space * 2 : 0);
                    let yCoord = y + i * space * 2;
                    room.setDiscProperties(discIds[discCounter], {
                        x: xCoord,
                        y: yCoord,
                        radius: size
                    });
                    discCounter++;
                }
            }
        }
    }
}

function getDigitMatrix(digit) {
    switch (digit) {
        case 0:
            return [[true, true, true], [true, false, true], [true, false, true], [true, false, true], [true, true, true]];
        case 1:
            return [[true, true, false], [false, true, false], [false, true, false], [false, true, false], [true, true, true]];
        case 2:
            return [[true, true, true], [false, false, true], [true, true, true], [true, false, false], [true, true, true]];
        case 3:
            return [[true, true, true], [false, false, true], [true, true, true], [false, false, true], [true, true, true]];
        case 4:
            return [[true, false, true], [true, false, true], [true, true, true], [false, false, true], [false, false, true]];
        case 5:
            return [[true, true, true], [true, false, false], [true, true, true], [false, false, true], [true, true, true]];
        case 6:
            return [[true, true, true], [true, false, false], [true, true, true], [true, false, true], [true, true, true]];
        case 7:
            return [[true, true, true], [false, false, true], [false, false, true], [false, false, true], [false, false, true]];
        case 8:
            return [[true, true, true], [true, false, true], [true, true, true], [true, false, true], [true, true, true]];
        case 9:
            return [[true, true, true], [true, false, true], [true, true, true], [false, false, true], [false, false, true]];
    }
}

// Um exemplo de como usar:
function drawNumber(value) {
    if (!room.getScores()) return;

    const discs = JSON.parse(classicMap().replace(/([/*]+[ ]+[0-9]+[ ]+[*/].)/g, "")).discs;
    const discIds = [];

    // Ignorei o número 0, pois representa a bola, e os números 1, 2, 3 e 4, pois representam as traves dos gols.
    for (let i = 5; i < room.getDiscCount(); i++) {
        if (discIds.length >= discs.length - 4) continue;
        discIds.push(i);
        
        // Resetando o tamanho dos discos.
        room.setDiscProperties(i, {
            radius: 0
        });
    }

    generateNumbersWithDiscs(value, discIds, 5, 5, {x:0, y:-180});
}

const room = HBInit({});
room.setCustomStadium(classicMap());

room.onPlayerJoin = () => {
    drawNumber(room.getPlayerList().length);
};

room.onPlayerLeave = () => {
    drawNumber(room.getPlayerList().length);
};

room.onGameStart = () => {
    drawNumber(room.getPlayerList().length);
};

// Recomendo criar discos que não entrem em colisão com nada.
function classicMap() {
    return `{ "name" : "Classic", "width" : 420, "height" : 200, "spawnDistance" : 170, "bg" : { "type" : "grass", "width" : 370, "height" : 170, "kickOffRadius" : 75, "cornerRadius" : 0 }, "vertexes" : [ /* 0 */ { "x" : -370, "y" : 170, "trait" : "ballArea" }, /* 1 */ { "x" : -370, "y" : 64, "trait" : "ballArea" }, /* 2 */ { "x" : -370, "y" : -64, "trait" : "ballArea" }, /* 3 */ { "x" : -370, "y" : -170, "trait" : "ballArea" }, /* 4 */ { "x" : 370, "y" : 170, "trait" : "ballArea" }, /* 5 */ { "x" : 370, "y" : 64, "trait" : "ballArea" }, /* 6 */ { "x" : 370, "y" : -64, "trait" : "ballArea" }, /* 7 */ { "x" : 370, "y" : -170, "trait" : "ballArea" }, /* 8 */ { "x" : 0, "y" : 200, "trait" : "kickOffBarrier" }, /* 9 */ { "x" : 0, "y" : 75, "trait" : "kickOffBarrier" }, /* 10 */ { "x" : 0, "y" : -75, "trait" : "kickOffBarrier" }, /* 11 */ { "x" : 0, "y" : -200, "trait" : "kickOffBarrier" }, /* 12 */ { "x" : -380, "y" : -64, "trait" : "goalNet" }, /* 13 */ { "x" : -400, "y" : -44, "trait" : "goalNet" }, /* 14 */ { "x" : -400, "y" : 44, "trait" : "goalNet" }, /* 15 */ { "x" : -380, "y" : 64, "trait" : "goalNet" }, /* 16 */ { "x" : 380, "y" : -64, "trait" : "goalNet" }, /* 17 */ { "x" : 400, "y" : -44, "trait" : "goalNet" }, /* 18 */ { "x" : 400, "y" : 44, "trait" : "goalNet" }, /* 19 */ { "x" : 380, "y" : 64, "trait" : "goalNet" } ], "segments" : [ { "v0" : 0, "v1" : 1, "trait" : "ballArea" }, { "v0" : 2, "v1" : 3, "trait" : "ballArea" }, { "v0" : 4, "v1" : 5, "trait" : "ballArea" }, { "v0" : 6, "v1" : 7, "trait" : "ballArea" }, { "v0" : 12, "v1" : 13, "curve" : -90, "trait" : "goalNet" }, { "v0" : 13, "v1" : 14, "trait" : "goalNet" }, { "v0" : 14, "v1" : 15, "curve" : -90, "trait" : "goalNet" }, { "v0" : 16, "v1" : 17, "curve" : 90, "trait" : "goalNet" }, { "v0" : 17, "v1" : 18, "trait" : "goalNet" }, { "v0" : 18, "v1" : 19, "curve" : 90, "trait" : "goalNet" }, { "v0" : 8, "v1" : 9, "trait" : "kickOffBarrier" }, { "v0" : 9, "v1" : 10, "curve" : 180, "cGroup" : ["blueKO" ], "trait" : "kickOffBarrier" }, { "v0" : 9, "v1" : 10, "curve" : -180, "cGroup" : ["redKO" ], "trait" : "kickOffBarrier" }, { "v0" : 10, "v1" : 11, "trait" : "kickOffBarrier" } ], "goals" : [ { "p0" : [-370,64 ], "p1" : [-370,-64 ], "team" : "red" }, { "p0" : [370,64 ], "p1" : [370,-64 ], "team" : "blue" } ], "discs" : [ { "pos" : [-370,64 ], "color" : "FFCCCC", "trait" : "goalPost" }, { "pos" : [-370,-64 ], "color" : "FFCCCC", "trait" : "goalPost" }, { "pos" : [370,64 ], "color" : "CCCCFF", "trait" : "goalPost" }, { "pos" : [370,-64 ], "color" : "CCCCFF", "trait" : "goalPost" }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ] }, { "radius" : 4.242640687119285, "pos" : [-241,-52 ], "cMask" : ["c0" ], "cGroup" : ["ball" ], "_selected" : true } ], "planes" : [ { "normal" : [0,1 ], "dist" : -170, "trait" : "ballArea" }, { "normal" : [0,-1 ], "dist" : -170, "trait" : "ballArea" }, { "normal" : [0,1 ], "dist" : -200, "bCoef" : 0.1 }, { "normal" : [0,-1 ], "dist" : -200, "bCoef" : 0.1 }, { "normal" : [1,0 ], "dist" : -420, "bCoef" : 0.1 }, { "normal" : [-1,0 ], "dist" : -420, "bCoef" : 0.1 } ], "traits" : { "ballArea" : { "vis" : false, "bCoef" : 1, "cMask" : ["ball" ] }, "goalPost" : { "radius" : 8, "invMass" : 0, "bCoef" : 0.5 }, "goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball" ] }, "kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO","blueKO" ], "cMask" : ["red","blue" ] } }, "joints" : [ ], "redSpawnPoints" : [ ], "blueSpawnPoints" : [ ] }`
}