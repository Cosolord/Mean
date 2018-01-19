// Questo file serve per la connessione in modo nativo al database mongodb, senza quindi l'ausilio di mongoose.
//Lo tengo per vedere la differenza tra i due ma nel progetto non sarà usato. Mi serve inoltre per verificare quali sono
//le strutture da utilizzare per la connessione e fare i confronti tra i vari corsi. Ad esempio questo corso propone
//questa struttura col driver nativo di mongodb che mi sembra più efficace rispetto agli altri (da verificare). Infatti usa due metodi, uno
//per aprire il database (una volta sola) ed uno (il metodo get) per richiamarlo ogni volta senza aprire e chiudere il database
//come fanno in molti altri corsi perchè sebbene sia facile fare in quel modo per piccoli progetti, nei progetti definitivi non
//conviene assolutamente perchè può portare ad errori e SICURAMENTE rallenta l'applicazione!


var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanHotel';

var _connection = null;
var open = function(){
  MongoClient.connect(dburl, function(err, db){
    if(err){
      console.log("Non riesco a connettermi al database");
      return;
    }
    _connection = db;
    console.log("Connessione al DB aperta ------");
  });
};

var get = function(){
  return _connection;
};

module.exports = {
  open,
  get
};
