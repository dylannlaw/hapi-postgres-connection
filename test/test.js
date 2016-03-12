var test = require('tape'); // testing done simple ;-)
var Hapi = require('hapi');
var VALID_POSTGRES_URL =  process.env.POSTGRES_URL;
// require('./_create_test_db.js');
/************************* TESTS ***************************/

test("server.register plugin fails when POSTGRES_URL undefined", function (t) {
  // temporarily set process.env.POSTGRES_URL to an Invalid url:
  delete process.env.POSTGRES_URL;
  var server1 = new Hapi.Server();
  server1.connection();
  try {  // attempt to boot the server with an invalid POSTGRES_URL
    server1.register({ register: require('../index.js') }, function(err) {
      console.log(err); // this error is never reached as the assert is fatal!
    });
  } catch (e) {
    t.ok(e.toString().indexOf('Please set POSTGRES_URL') > 1,
      'Please set POSTGRES_URL Env Variable');
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
      process.env.POSTGRES_URL = VALID_POSTGRES_URL; // restore valid POSTGRES_URL
    t.end();
  }); // connection will fail because of invalid POSTGRES_URL
});

var server = require('./server_example.js');

test("Connect to Valid POSTGRES_URL", function (t) {
  server.inject('/', function(response) {
    // t.equal(response.statusCode, 200, "Find Person in Database");
    t.equal(response.result.id, 1, "Person found in Postgres DB")
    // server.stop(function(){  t.end() });
  });

  var options = {
    method: 'POST',
    url: '/insert',
    payload: { message: 'Ground control to major Tom.'}
  }
  server.inject(options, function(response) {
    // t.equal(response.statusCode, 200, "Find Person in Database");
    t.equal(response.result.log_id, 1, "Log found in Postgres DB")
    server.stop(function(){  t.end() });
  });

});
