var test = require('tape'); // testing done simple ;-)
var Hapi = require('hapi');
var VALID_POSTGRES_URL =  process.env.POSTGRES_URL;

/************************* TESTS ***************************/

test("server.register plugin fails when POSTGRES_URL undefined", function (t) {
  // temporarily set process.env.POSTGRES_URL to an Invalid url:
  delete process.env.POSTGRES_URL;
  console.log(process.env.POSTGRES_URL);
  var server1 = new Hapi.Server();
  server1.connection();
   // attempt to boot the server with an invalid POSTGRES_URL
  try {
    server1.register({ register: require('../index.js') }, function(err) {
      console.log(err); // this error is never reached as the assert is fatal!
    });
  } catch (e) {
    t.ok(e.toString().indexOf('Please set POSTGRES_URL') > 1,
      'Please set POSTGRES_URL Environment Variable');
    t.end();
  }

});

test("Test connecting to an invalid POSTGRES_URL", function (t) {
  // temporarily set process.env.POSTGRES_URL to an Invalid url:
  process.env.POSTGRES_URL = 'postgres://postgres:wrongPASSWORD@localhost/nodb';
  var pg = require('../index.js');
  pg.connect(function connect_callback (err) {
    t.equal(err.message, 'database "nodb" does not exist',
      'Cannot Connect to non-existent DB');
    t.end();
  }); // connection will fail because of invalid POSTGRES_URL
});

test("Connect to Valid POSTGRES_URL", function (t) {
  process.env.POSTGRES_URL = VALID_POSTGRES_URL; // restore valid POSTGRES_URL
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

  server.inject('/', function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    console.log(response.result);
    server.stop(function(){  t.end() });
  });
});
