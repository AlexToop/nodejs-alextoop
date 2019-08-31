'use strict';


var https = require('https');
var http = require('http');
var path = require('path');


var port = 443;
var insecurePort = 80;
var fs = require('fs');
var checkip = require('check-ip-address');
var server;
var insecureServer;
var options;
var IS_PRODUCTION = true;


function productionRun(){
    var certsPath = path.join('/etc/letsencrypt/live/www.alextoop.com/');
    var caCertsPath = path.join('/etc/letsencrypt/live/www.alextoop.com/');
    options = {
        key: fs.readFileSync(path.join(certsPath, 'privkey.pem')),
        cert: fs.readFileSync(path.join(caCertsPath, 'fullchain.pem'))
    };


    server = https.createServer(options);


    checkip.getExternalIp().then(function (ip) {
        var host = ip || 'www.alextoop.com';

        function listen(app) {
            server.on('request', app);
            console.log("\nThe port is: " + port + "\n");
            server.listen(port, function () {
            });
        }

        var publicDir = path.join(__dirname, '..', 'public');
        var app = require('../app').create(server, host, port, publicDir);

        listen(app);
    });
}


function devRun(){
    var host = checkip.getExternalIp();
    server = http.createServer(options);
    var publicDir = path.join(__dirname, '..', 'public');
    var app = require('../app').create(server, host, port, publicDir);
    server.on('request', app);
    server.listen(port);
}


function catchInsecureConnections(){
    insecureServer = http.createServer();

    insecureServer.on('request', function (req, res) {
        if (req && req.headers && req.headers.host) {
            res.setHeader('Location', 'https://' + req.headers.host.replace(/:\d+/, ':' + port) + req.url);
            res.statusCode = 302;
            res.end();
        }
    });

    insecureServer.listen(insecurePort, function () {
        console.log("\nRedirecting all http traffic to https\n");
    });

    insecureServer.listen(insecurePort);
}


function run(){
    catchInsecureConnections();

    if (IS_PRODUCTION) {
        productionRun();
    } else {
        devRun();
    }    
}


run();