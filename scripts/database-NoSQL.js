/**
 * applications > IndexedDB
 * 
 * No exemplo a seguir vou mostrar como criar algo dentro do Indexed Database API usando o framework Dexie
 * 
 * LINK DO Dexie: https://dexie.org/docs/Tutorial/Hello-World
 * LINK DO IndexedDB: https://developer.mozilla.org/pt-BR/docs/Web/API/IndexedDB_API
 */

 let db;

 createDB();
 
 const room = HBInit({});
 
 room.onPlayerJoin = player => {
 
     const my = db.players.get(player.conn);
 
     /**
      * SE O JOGADOR JÁ TIVER SEUS DADOS SALVOS O BOT ENVIA UMA MENSAGEM AVISANDO
      */
     if (my._value) room.sendAnnouncement("Seus dados estão salvos!", player.id);
     else pushUserToDB(player);
 
 }
 
 function addAPI() {
 
     /**
      * ADICIONANDO A API
      */
     const a = document.createElement("script");
     a.src = "https://unpkg.com/dexie/dist/dexie.js";
     document.body.append(a);
 
 }
 
 async function createDB() {
 
     addAPI();
 
     /**
      * DEFININDO UM ATRASO DE 2 SEGUNDOS
      */
     await new Promise(resolve => setTimeout(resolve, 2000));
 
     /**
      * NOMEANDO A DB
      */
     db = new Dexie("myFirstDBNoSQL");
 
     /**
      * CRIANDO UMA COLEÇÃO
      */
     db.version(1).stores({
         players: `conn`
     });
 
 }
 
 function pushUserToDB(player) {
 
     db.players.bulkAdd([{
         joinedIn: Date.now(),
         ...player
     }]);
 
 }