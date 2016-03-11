var Hapi = require('hapi');
var escape = require('pg-escape'); // https://github.com/segmentio/pg-escape

var server = new Hapi.Server({ debug: { request: ['error'] } });
server.connection();
server.register({ register: require('../index.js') }, function(err) {
  t.ok(!err, 'No error connecting to postgres');
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    // console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - >>>');
    // console.log('request.pg', request.pg.client.query);
    // console.log('<<< - - - - - - - - - - - - - - - - - - - - - - - - - - -');
    return reply('hello');
  }
});
