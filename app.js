var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var faction1 = require('./routes/faction1');
var faction2 = require('./routes/faction2');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/faction1', faction1);
app.use('/faction2', faction2);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('MUNChina listening at http://%s:%s', host, port);

});

//Socket IO stuff
var http = require('http');
var thisServer = http.createServer(app);
var io = require('socket.io').listen(thisServer);
thisServer.listen(4000);

var shadeFac1 = [];
var shadeFac2 = [];
var territories = [];
var resources = [];

for (var i = 0; i < 26; i++) {
  shadeFac1[i] = 0;
  shadeFac2[i] = 0;
  territories[i] = 0;
  resources[i] = "No Resources";
}

io.on('connection', function(socket) {
  console.log('Client Connected');
  socket.on('initialstate', function(msg) {
    console.log("initial state");
    socket.emit('initialstate', {'shade1' : shadeFac1, 'shade2': shadeFac2, 'territories': territories, 'resources': resources});
  });
  
  socket.on('resources', function(msg) {
    console.log(msg);
    resources = msg.resources;
    socket.broadcast.emit('resources', msg);
  });

  socket.on('update', function(msg) {
    console.log(msg);
    shadeFac1 = msg["faction1"];
    shadeFac2 = msg["faction2"];
    territories = msg["territories"];
    socket.broadcast.emit('update', msg);
  });
});

//Every 5 ms, send an update about board state to all clients
//Each 

