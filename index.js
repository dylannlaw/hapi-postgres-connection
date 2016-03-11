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

    if (err) {
      console.log('POSTGRES err', err);
      server.log(['error', 'hapi-postgres-connection'], 'Postgres Connection Failed');
      return callback(err);
    }
    server.log(['info', 'hapi-postgres-connection'], 'Postgres Connection Active');
    // console.log(' - - - - - -- - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
    console.log('CONNECTED TO POSTGRES_URL: ', process.env.POSTGRES_URL, ++CON);
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

  server.ext('onRequest', function(request, reply) {
    console.log(' > > > > > > > > > > > > onRequest < < < < < < < < < < < < ');
    connect(server, function () {
      request.pg = {
        client: CLIENT,
        done: DONE
      }
      reply.continue();
    });
  });

  server.on('tail', function(request, err) {
    console.log('Stopping the server takes a while for some reason...');
    console.log(CLIENT.readyForQuery);
    console.log(DONE);
    // if(CLIENT) {
      CLIENT.end();
      DONE();
    // console.log(process);
    console.log('WHY?!');
      // server.plugins['hapi-postgres-connection'].client.end()
      // server.plugins['hapi-postgres-connection'].done();
    server.log(['info', 'hapi-postgres-connection'], 'Postgres Connection Closed');
    // process.exit;
    return;
  });

  // connect(server, function (err) {
  next();
  // });
};

exports.register.attributes = {
  pkg: pkg
};
