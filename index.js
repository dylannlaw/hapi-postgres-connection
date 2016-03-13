var pg = require('pg');
var assert = require('assert');
var internals = {};
var pkg = require('./package.json');
var run_once = false;
exports.register = function(server, options, next) {
  // if POSTGRES_URL Environment Variable is unset halt the server.start
  assert(process.env.POSTGRES_URL, 'Please set POSTGRES_URL Env Variable');

  server.ext('onPreHandler', function (request, reply) {
    pg.connect(process.env.POSTGRES_URL, function(err, client, done) {
      server.log(['info', pkg.name], 'DB Connection Active');
      request.postgres = {
        client: client,
        done: done
      }

      server.on('stop', function() {
        done();
        client.end();
        server.log(['info', pkg.name], 'DB Connection Closed');
      });

      reply.continue();

    });
  });

  next();
};

exports.register.attributes = {
  pkg: pkg
};
