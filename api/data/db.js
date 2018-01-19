var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanHotel';

mongoose.connect(dburl, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', function(){
  console.log('Mongoose connesso a ' + dburl);
});

mongoose.connection.on('disconnected', function(){
  console.log("Mongoose disconnesso");
});

mongoose.connection.on('error', function(err){
  console.log("Mongoose errore di connessione: " + err);
});

// //SIGINT, SIGTERM, SIGUSR2 sono segnali inviati al verificarsi di alcune condizioni. Non sono supportati interamente da windows ma solo su mac e linux
// process.on('SIGINT', function(){
//   mongoose.connection.close(function(){
//   console.log("Mongoose disconnesso tramite chiusura dell'app (SIGINT)");
//   process.exit(0);
//   });
// });

// process.on('SIGTERM', function(){
//   mongoose.connection.close(function(){
//   console.log("Mongoose disconnesso tramite chiusura dell'app (SIGTERM)");
//   process.exit(0);
//   });
// });
//
// process.once('SIGUSR2', function(){
//   mongoose.connection.close(function(){
//   console.log("Mongoose disconnesso tramite chiusura dell'app (SIGUSR2)");
//   process.kill(process.pid, 'SIGUSR2');
//   });
// });


require('./hotels.model.js')
