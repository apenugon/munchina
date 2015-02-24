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

io.on('connection', function(socket) {
  console.log('Client Connected');
  socket.on('faction1Shade', function(msg) {
    console.log(msg);
    socket.broadcast.emit("updateFac1Shade", msg);
  });
  socket.on('faction2Shade', function(msg) {
    console.log(msg);
    socket.broadcast.emit("updateFac2Shade", msg);
  });
  socket.on('territories', function(msg) {
    console.log(msg);
    socket.broadcast.emit('territories', msg);
  });
});

//Every 5 ms, send an update about board state to all clients
//Each 

