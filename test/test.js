require('./_create_test_db.js');

var test = require('tape'); // testing done simple ;-)
var Hapi = require('hapi');
var VALID_DATABASE_URL =  process.env.DATABASE_URL;
/************************* TESTS ***************************/

test("server.register plugin fails when DATABASE_URL undefined", function (t) {
  // temporarily set process.env.DATABASE_URL to an Invalid url:
  delete process.env.DATABASE_URL;
  var server1 = new Hapi.Server();
  server1.connection();
  try {  // attempt to boot the server with an invalid DATABASE_URL
    server1.register({ register: require('../index.js') }, function(err) {
      console.log(err); // this error is never reached as the assert is fatal!
    });
  } catch (e) {
    t.ok(e.toString().indexOf('Please set DATABASE_URL') > 1,
      'Please set DATABASE_URL Env Variable');
    t.end();
  }
});

// test.only("Test connecting to an invalid DATABASE_URL", function (t) {
//   // temporarily set process.env.DATABASE_URL to an Invalid url:
//   process.env.DATABASE_URL = 'postgres://postgres:wrongPASSWORD@localhost/nodb';
//   var server1 = new Hapi.Server();
//   server1.connection();
//   try {  // attempt to boot the server with an invalid DATABASE_URL
//     server1.register({ register: require('../index.js') }, function(err) {
//       console.log('HAI!');
//       console.log(err); // this error is never reached as the assert is fatal!
//     });
//   } catch (e) {
//     t.ok(e.toString().indexOf('Please set DATABASE_URL') > 1,
//       'Please set DATABASE_URL Env Variable');
//     t.end();
//   }
// });



test("Connect to Valid DATABASE_URL", function (t) {
  process.env.DATABASE_URL = VALID_DATABASE_URL; // restore valid DATABASE_URL
  var server = require('./server_example.js');
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
    t.equal(response.result.log_id, 2, "Log found in Postgres DB")
    server.stop(function(){  t.end() });
  });
});
