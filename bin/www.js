'use strict'

var https = require('https')
var http = require('http')
var path = require('path')

var securePort = 443
var insecurePort = 80
var fs = require('fs')
var checkip = require('check-ip-address')
var publicDir = path.join(__dirname, '..', 'public')
var IS_PRODUCTION = true

function productionRun () {
  var certsPath = path.join('/etc/letsencrypt/live/www.alextoop.com/')
  var caCertsPath = path.join('/etc/letsencrypt/live/www.alextoop.com/')
  var options = {
    key: fs.readFileSync(path.join(certsPath, 'privkey.pem')),
    cert: fs.readFileSync(path.join(caCertsPath, 'fullchain.pem'))
  }
  var server = https.createServer(options)

  checkip.getExternalIp().then(function (ip) {
    var host = ip || 'www.alextoop.com'
    var app = require('../app').create(server, host, securePort, publicDir)

    server.on('request', app)
    server.listen(securePort)
  })
}

function devRun () {
  var server
  var host = checkip.getExternalIp()
  server = http.createServer()
  var app = require('../app').create(server, host, securePort, publicDir)

  server.on('request', app)
  server.listen(securePort)
}

function catchInsecureConnections () {
  var insecureServer = http.createServer()

  insecureServer.on('request', function (req, res) {
    if (req && req.headers && req.headers.host) {
      res.setHeader('Location', 'https://' + req.headers.host.replace(/:\d+/, ':' + securePort) + req.url)
      res.statusCode = 302
      res.end()
    }
  })

  insecureServer.listen(insecurePort, function () {
    console.log('\nRedirecting all http traffic to https\n')
  })
}

function run () {
  catchInsecureConnections()

  if (IS_PRODUCTION) {
    productionRun()
  } else {
    devRun()
    console.log('\nUse http://localhost:443/')
  }
}

run()
