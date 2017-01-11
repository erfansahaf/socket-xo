var express = require('express');
var path = require('path');

var app = express();
global.http = require('http').Server(app);
var Datastore = require('nedb');
global.db = new Datastore({ filename: path.join(__dirname, 'databases', 'logs.db'), autoload: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));


http.listen(3000, function(){
    console.log('listening on *:3000');
});

module.exports = app;
