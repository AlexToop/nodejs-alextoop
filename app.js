'use strict'

var express = require('express')

module.exports.create = function (server, host, port, publicDir) {
  var app = express()
  var cors = require('cors')
  var routes = require('./routes/index.js')

  app.use(cors())
  app.use(express.static(publicDir))
  routes(app, publicDir)

  return app
}
