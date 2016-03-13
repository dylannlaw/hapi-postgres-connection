var pg = require('pg');
var assert = require('assert');
var internals = {};
var pkg = require('./package.json');
var run_once = false;
exports.register = function(server, options, next) {
  // if DATABASE_URL Environment Variable is unset halt the server.start
  assert(process.env.DATABASE_URL, 'Please set DATABASE_URL Env Variable');
  // yes, this creates multiple connections
  server.ext('onPreHandler', function (request, reply) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      assert(!err, pkg.name + 'ERROR Connecting')
      server.log(['info', pkg.name], 'DB Connection Active');
      request.postgres = {
        client: client,
        done: done
      }
      // each connection created is shut down when the server stops (e.g tests)
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
