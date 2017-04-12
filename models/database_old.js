// pg module to connect and query the postgresql database
var pg = require('pg');

// connection string for postgres
// TODO: use env variables
// TODO: use config object(s)
var connectString = 'postgres://midjametadata:midjametadata@localhost/midjametadatadb';

var client = new pg.Client(connectString);
client.connect();

var query = client.query('CREATE TABLE datasets(name VARCHAR PRIMARY KEY, title VARCHAR, abstract VARCHAR, publication_date VARCHAR, author VARCHAR, organisation VARCHAR, geolevel VARCHAR(10))');

// simply close client when all queries have executed
client.on('drain', function() { client.end(); });
