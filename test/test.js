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
  console.log(process.env.POSTGRES_URL);
  var server1 = new Hapi.Server();
  server1.connection();
   // attempt to boot the server with an invalid POSTGRES_URL
  server1.register({ register: require('../index.js') }, function(err) {
    // console.log(' - - - - - - - - - -> server1 plugin err:');
    // console.log(err);
    t.equal(err.message, 'database "nodb" does not exist',
      'Cannot Connect to non-existent DB');
    require('decache')('../index.js'); // decache so we can require again
    t.end();
  });
});

test.only("Connect to Valid POSTGRES_URL", function (t) {
  // temporarily set process.env.POSTGRES_URL to an Invalid url:
  process.env.POSTGRES_URL = VALID_POSTGRES_URL;
  var server = new Hapi.Server({ debug: { request: ['error'] } });
  server.connection();
   // attempt to boot the server with an invalid POSTGRES_URL
  server.register({ register: require('../index.js') }, function(err) {
    t.ok(!err, 'No error connecting to postgres');
    // server.plugins['hapi-postgres-connection'].client.end()
    // server.plugins['hapi-postgres-connection'].done();
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - >>>');
      console.log(request.pg);
      console.log('<<< - - - - - - - - - - - - - - - - - - - - - - - - - - -');
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
