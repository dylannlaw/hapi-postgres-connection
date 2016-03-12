var pg = require('pg');
var assert = require('assert');
var internals = {};
var pkg = require('./package.json');

var CLIENT, DONE, CON = 0; // Don't worry these "Globals" are scoped by module

function connect (callback) {
  console.log('>>>> CON: ', ++CON);
  if (CLIENT || DONE) {
    console.log(CLIENT, DONE);
    return callback();
  }
  pg.connect(process.env.POSTGRES_URL, function(err, client, done) {
    if(err) {
      return callback(err);
    }
    CLIENT = client; // make available for all subs
    DONE = done;
    return callback(err);
  });
}
exports.connect = connect;

exports.register = function(server, options, next) {
  // if POSTGRES_URL Environment Variable is unset halt the server.start
  assert(process.env.POSTGRES_URL, 'Please set POSTGRES_URL Env Variable');

  server.ext('onPreHandler', function (request, reply) {
    connect(function (err) {
      server.log(['info', 'hapi-postgres-connection'], 'DB Connection Active');
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
    server.log(['info', 'hapi-postgres-connection'], 'DB Connection Closed');
  });

  next();
};

exports.register.attributes = {
  pkg: pkg
};
