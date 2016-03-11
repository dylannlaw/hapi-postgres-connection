var test = require('tape');
// we display the file (name) in each test name for stack trace
var dir = __dirname.split('/')[__dirname.split('/').length-1];
var file = dir + __filename.replace(__dirname, '') + ' -> ';

var pg = require('pg');
var assert = require('assert');

function create_tables (callback) {
  pg.connect(process.env.POSTGRES_URL, function(err, client, done) {
    assert(!err); // if db connection fails then EXPLODE!!
    var file = require('path').resolve(__dirname + '/test_db_setup.sql');
    var query = require('fs').readFileSync(file, 'utf8').toString();
    // see: http://stackoverflow.com/a/13823560/1148249
    console.log('\n', query);
    client.query(query, function(err, result) {
      done();       // call `done()` to release the client back to the pool
      client.end(); // close connection to database
      return callback(err, result);
    });
  });
}

test('Create "users" table in test databse', function (t) {
  create_tables(function (err, data) {
    // console.log(data);
    t.equal(data.command, 'INSERT', 'DB Table Created & Test Data Inserted');
    t.end();
  })
});
