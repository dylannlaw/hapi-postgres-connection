var pg = require('pg');
var assert = require('assert');
var internals = {};
var pkg = require('./package.json');

var CLIENT, DONE, CON = 0; // Don't worry these "Globals" are scoped by module

function connect (server, callback) {
  if (CLIENT || DONE) {
    return callback();
  }
  pg.connect(process.env.POSTGRES_URL, function(err, client, done) {
    // assert(!err, 'Unable to connect to Postgres on:' + process.env.POSTGRES_URL);
    if(err) {
      return callback(err);
    }
    server.log(['info', 'hapi-postgres-connection'], 'Postgres Connection Active');
    console.log('CONNECTED TO POSTGRES_URL: ', process.env.POSTGRES_URL, ++CON);
    CLIENT = client;
    DONE = done;
    return callback();
  });
}
exports.connect = connect;

exports.register = function(server, options, next) {
  // if POSTGRES_URL Environment Variable is unset halt the server.start
  assert(process.env.POSTGRES_URL, 'Please set POSTGRES_URL Environment Variable');

  server.ext('onRequest', function(request, reply) {
    console.log(' > > > > > > > > > > > > onRequest < < < < < < < < < < < < ');
    connect(server, function (err) {
      request.pg = {
        client: CLIENT,
        done: DONE
      }
      reply.continue();
    });
  });

  server.on('tail', function(request, err) {
    CLIENT.end();
    DONE();
    server.log(['info', 'hapi-postgres-connection'], 'Postgres Connection Closed');
  });

  // connect(server, function (err) {
  next();
  // });
};

exports.register.attributes = {
  pkg: pkg
};
