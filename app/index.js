'use strict';


var express = require('express'),
    log = require('utils/logger')(module),
    app = express(),
    passport = require('passport'),
    session = require('express-session'),
    initializedMongo = require('app/models');

var http = require('http').Server(app);

http.on('error', function (err) {
    log.error('HTTP Error', err.message);
    log.error(err.stack);
});

app.use('/blogs', require('app/routes')(app));
app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('serve-static')(__dirname + '/../../public'));

module.exports.start = function (host, port) {
    http.listen(port, host, function () {
        log.info('HTTP Server is ready now @ ', host, ':', port);
    });
};
