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
