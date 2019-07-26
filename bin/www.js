// #!/usr/bin/env node
//
// /**
//  * Module dependencies.
//  */
//
// var app = require('../app');
// var debug = require('debug')('alextoop-website:server');
// var http = require('http');
//
// /**
//  * Get port from environment and store in Express.
//  */
//
// var port = normalizePort(process.env.PORT || '80');
// app.set('port', port);
//
//
// // var https = require('https');
// // var fs = require('fs');
//
// // var privateKey = fs.readFileSync(PRIVATEKEY_PATH, 'utf8');
// // var certificate = fs.readFileSync(CERTIFICATE_PATH, 'utf8');
// // var credentials = {key: privateKey, cert: certificate};
// // var PRIVATEKEY_PATH = path.join(__dirname, '../../../../apache2/conf/server.key');
// // var CERTIFICATE_PATH = path.join(__dirname, '../../../../apache2/conf/server.crt');
// // var httpsServer = https.createServer(credentials, app);
// // httpsServer.listen(443);
//
// /**
//  * Create HTTP server.
//  */
//
// var server = http.createServer(app);
//
//
// /**
//  * Listen on provided port, on all network interfaces.
//  */
//
// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);
//
// /**
//  * Normalize a port into a number, string, or false.
//  */
//
// function normalizePort(val) {
//     var port = parseInt(val, 10);
//
//     if (isNaN(port)) {
//         // named pipe
//         return val;
//     }
//
//     if (port >= 0) {
//         // port number
//         return port;
//     }
//
//     return false;
// }
//
// /**
//  * Event listener for HTTP server "error" event.
//  */
//
// function onError(error) {
//     if (error.syscall !== 'listen') {
//         throw error;
//     }
//
//     var bind = typeof port === 'string'
//         ? 'Pipe ' + port
//         : 'Port ' + port;
//
//     // handle specific listen errors with friendly messages
//     switch (error.code) {
//         case 'EACCES':
//             console.error(bind + ' requires elevated privileges');
//             process.exit(1);
//             break;
//         case 'EADDRINUSE':
//             console.error(bind + ' is already in use');
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// }
//
// /**
//  * Event listener for HTTP server "listening" event.
//  */
//
// function onListening() {
//     var addr = server.address();
//     var bind = typeof addr === 'string'
//         ? 'pipe ' + addr
//         : 'port ' + addr.port;
//     debug('Listening on ' + bind);
// }

'use strict';

var https = require('https');
var http = require('http');
var path = require('path');
var port = process.argv[2] || 443;
var insecurePort = process.argv[3] || 80;
var fs = require('fs');
var checkip = require('check-ip-address');
var server;
var insecureServer;
var options;
var certsPath = path.join('/etc/letsencrypt/live/www.alextoop.com/');
var caCertsPath = path.join('/etc/letsencrypt/live/www.alextoop.com/');
var IS_PRODUCTION = true;


insecureServer = http.createServer();

insecureServer.on('request', function (req, res) {
    res.setHeader('Location', 'https://' + req.headers.host.replace(/:\d+/, ':' + port) + req.url);
    res.statusCode = 302;
    res.end();
});

insecureServer.listen(insecurePort, function () {
    console.log("\nRedirecting all http traffic to https\n");
});


if (IS_PRODUCTION) {
    options = {
        key: fs.readFileSync(path.join(certsPath, 'privkey.pem')),
        cert: fs.readFileSync(path.join(caCertsPath, 'fullchain.pem'))
    };

    server = https.createServer(options);
    console.log("\nCreated server\n");
    checkip.getExternalIp().then(function (ip) {
        var host = ip || 'www.alextoop.com';
        console.log("\nThe ip is: " + host + "\n");

        function listen(app) {
            server.on('request', app);
            console.log("\nThe port is: " + port + "\n");
            server.listen(port, function () {
                port = server.address().port;
                console.log('Listening on https://127.0.0.1:' + port);
                console.log('Listening on https://www.alextoop.com:' + port);
                if (ip) {
                    console.log('Listening on https://' + ip + ':' + port);
                }
            });
        }

        var publicDir = path.join(__dirname, '..', 'public');
        var app = require('../app').create(server, host, port, publicDir);
        listen(app);
    });
} else {
    var host = checkip.getExternalIp();
    server = http.createServer(options);
    var publicDir = path.join(__dirname, '..', 'public');
    var app = require('../app').create(server, host, port, publicDir);
    server.on('request', app);
    server.listen(port);
}
