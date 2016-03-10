var pg = require('pg');
var assert = require('assert');
var internals = {};
var pkg = require('./package.json');
exports.register = function(server, options, next) {
  // if POSTGRES_URL Environment Variable is unset halt the server.start
  assert(process.env.POSTGRES_URL, 'Please set POSTGRES_URL Environment Variable');

  pg.connect(process.env.POSTGRES_URL, function(err, client, done) {

    if (err) {
      server.log(['error', 'hapi-postgres-connection'], 'Postgres Connection Failed');
      return next(err);
    }
    server.log(['info', 'hapi-postgres-connection'], 'Postgres Connection Active');
    
    server.expose('client', client);
    server.expose('done', done);

    server.on('stop', function() {
      done();
      server.log(['info', 'hapi-postgres-connection'], 'Postgres Connection Closed');
    });

    next();
  });
};

exports.register.attributes = {
  pkg: pkg
};
