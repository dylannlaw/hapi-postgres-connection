var pg = require('pg');
var assert = require('assert');
var internals = {};
var pkg = require('./package.json');

var CLIENT, DONE; // Don't worry these "Globals" are scoped by module

function connect (server, callback) {
  console.log('CLIENT:',CLIENT);
  if (CLIENT) {
    return callback();
  }
  pg.connect(process.env.POSTGRES_URL, function(err, client, done) {

    if (err) {
      console.log('POSTGRES err', err);
      server.log(['error', 'hapi-postgres-connection'], 'Postgres Connection Failed');
      return callback(err);
    }
    server.log(['info', 'hapi-postgres-connection'], 'Postgres Connection Active');
    console.log(' - - - - - -- - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
    console.log('CONNECTED TO POSTGRES_URL: ', process.env.POSTGRES_URL);
    // server.expose('client', client);
    // server.expose('done', done);
    CLIENT = client;
    DONE = done;
    return callback();
  });
}

exports.register = function(server, options, next) {
  // if POSTGRES_URL Environment Variable is unset halt the server.start
  assert(process.env.POSTGRES_URL, 'Please set POSTGRES_URL Environment Variable');
  console.log(' - - - - - -- - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
  // console.log(next.toString());
  // console.log(' - - - - - -- - - - - - - - - - - - - - - - - - - - - - - - - - - - ')

  server.ext('onPreHandler', function(request, reply) {
    console.log(request.path)
    console.log(' > > > > > > > > > > > > onPreHandler < < < < < < < < < < < < ');
    connect(server, function () {
      request.pg = {
        client: CLIENT,
        done: DONE
      }
      reply.continue();
    });
  });

  server.on('stop', function(request, err) {
    console.log('Stopping the server takes a while for some reason...');
    console.log(CLIENT);
    console.log(DONE);
    if(CLIENT) {
      CLIENT.end();
      DONE();
    }
    server.log(['info', 'hapi-postgres-connection'], 'Postgres Connection Closed');
    return;
  });

  connect(server, function (err) {
    next(err);
  });
};

exports.register.attributes = {
  pkg: pkg
};
