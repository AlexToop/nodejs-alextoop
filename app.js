'use strict';

var express = require('express');

module.exports.create = function (server, host, port, publicDir) {
    var app = express();
    var cors = require('cors');

    app.use(cors());
    app.use(express.static(publicDir));
    // app.use(express.static(path.join(__dirname, '..', 'public')));

    return app;
};