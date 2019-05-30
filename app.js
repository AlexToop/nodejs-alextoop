var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var fs = require('fs');

var PRIVATEKEY_PATH = path.join(__dirname, '../../../apache2/conf/server.key');
var CERTIFICATE_PATH = path.join(__dirname, '../../../apache2/conf/server.crt');

var privateKey = fs.readFileSync(PRIVATEKEY_PATH, 'utf8');
var certificate = fs.readFileSync(CERTIFICATE_PATH, 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT, HOST);
httpsServer.listen(443, HOST);

module.exports = app;
