'use strict'
module.exports = function (app, publicDir) {
  app.get('/', function (req, res) {
    res.sendFile(publicDir + '/index.html')
  })

  app.get('/projects/', function (req, res) {
    res.sendFile(publicDir + '/projects.html')
  })

  app.get('/contact/', function (req, res) {
    res.sendFile(publicDir + '/contact.html')
  })
}
