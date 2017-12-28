
var express = require('express');
var app = express();
var path = require('path');
var routes = require('./api/routes');
var port = process.env.PORT || 3000;
app.use(function(req, res, next){
  console.log(req.method, req.url);
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);


app.listen(port, function(){
  console.log(`Server connesso alla porta ${port}`);
});
