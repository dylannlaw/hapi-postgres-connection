var assert = require('assert');

var pg = require('pg');
var internals = {};
var pkg = require('./package.json');
var _CON = []; // global
var run_once = false;

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  assert(!err, pkg.name + 'ERROR Connecting')
  _CON.push({ client: client, done: done});
  return;
});

exports.register = function(server, options, next) {
  // if DATABASE_URL Environment Variable is unset halt the server.start
  assert(process.env.DATABASE_URL, 'Please set DATABASE_URL Env Variable');

  server.ext('onPreAuth', function (request, reply) {
    // each connection created is shut down when the server stops (e.g tests)
    if(!run_once) {
      run_once = true;
      server.on('stop', function () { // only one server.on('stop') listener
        _CON.forEach(function (con) { // close all the connections
          con && con.client && con.client.readyForQuery && con.client.end();
          con && con.done && con.done();
        })
        server.log(['info', pkg.name], 'DB Connection Closed');
      });
    }

    request.pg = {
      client: _CON[0].client,
      done: _CON[0].done
    }
    reply.continue();
  });

  // server.ext('onPostHandler', function (request, reply) {
  //   request.pg && request.pg && request.pg.done();
  //   reply.continue();
  // });

  next();
};

exports.register.attributes = {
  pkg: pkg
};
