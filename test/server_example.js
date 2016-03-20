var Hapi = require('hapi');
var escape = require('pg-escape'); // https://github.com/segmentio/pg-escape
var assert = require('assert');

var server = new Hapi.Server({ debug: { request: ['error'] } });

server.connection();

server.register({
  register: require('../index.js')
}, function (err) {
  if (err) {
    console.error(err);
    throw err;
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    var email = 'test@test.net';
    var select = escape('SELECT * FROM people WHERE (email = %L)', email);
    request.pg.client.query(select, function(err, result) {
      return reply(result.rows[0]);
    })
  }
});

server.route({
  method: 'POST',
  path: '/insert',
  handler: function(request, reply) {
    var insert = escape('INSERT INTO logs (message) VALUES (%L)',
      request.payload.message);
    var select = 'SELECT * FROM logs WHERE (log_id = 2)';
    request.pg.client.query(insert, function(err, result) {
      // console.log(err, result)
      request.pg.client.query(select, function(err, result) {
        // console.log(err, result.rows)
        reply(result.rows[0]);
        return;
      })
    })
  }
});

server.route({
  method: 'GET',
  path: '/nopg',
  handler: function(request, reply) {
    return reply('nopg'); // does not make any PG queries
  }
});

server.start(function() {
  console.log('Visit: http://127.0.0.1:'+server.info.port);
});

module.exports = server;
