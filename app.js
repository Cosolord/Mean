// require('./api/data/dbconnection.js').open();       //questa riga è usata solo se uso il driver nativo di mongodb (senza mongoose quindi)
require('./api/data/db.js');     //qui utilizzo invece mongoose per collegarmi al database
var express = require('express'),
    bodyParser = require('body-parser');
var app = express();
var path = require('path');
var routes = require('./api/routes');
var port = process.env.PORT || 3000;
app.use(function(req, res, next){
  console.log(req.method, req.url);
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use('/api', routes);


app.listen(port, function(){
  console.log(`Server connesso alla porta ${port}`);
});
