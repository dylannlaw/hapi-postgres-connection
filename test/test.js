var test = require('tape'); // testing done simple ;-)
var Hapi = require('hapi');
var VALID_POSTGRES_URL =  process.env.POSTGRES_URL;

/************************* TESTS ***************************/

test("Test connecting to an invalid POSTGRES_URL", function (t) {
  // temporarily set process.env.POSTGRES_URL to an Invalid url:
  process.env.POSTGRES_URL = 'postgres://postgres:wrongPASSWORD@localhost/nodb';
  var server = new Hapi.Server();
  server.connection();
   // attempt to boot the server with an invalid POSTGRES_URL
  server.register({ register: require('../index.js') }, function(err) {
    t.equal(err.message, 'database "nodb" does not exist',
      'Cannot Connect to non-existent DB');
    t.end();
  });
});

test("Connect to Valid POSTGRES_URL", function (t) {
  // temporarily set process.env.POSTGRES_URL to an Invalid url:
  process.env.POSTGRES_URL = VALID_POSTGRES_URL;
  var server = new Hapi.Server({ debug: { request: ['error'] } });
  server.connection();
   // attempt to boot the server with an invalid POSTGRES_URL
  server.register({ register: require('../index.js') }, function(err) {
    t.ok(!err, 'No error connecting to postgres');
    server.plugins['hapi-postgres-connection'].client.end()
    server.plugins['hapi-postgres-connection'].done();
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply('hello');
    }
  });

  var options = {
    method: "GET",
    url: "/"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    server.stop(function(){ t.end() });
  });
  // server.start(function () {
  //   server.stop(function () {
  //     // done();
  //     t.end();
  //   });
  // });
});
