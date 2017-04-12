// pg module to connect and query the postgresql database
var pg = require('pg');

// connection string for postgres
// TODO: use env variables
// TODO: use config object(s)
var connectString = 'postgres://midjametadata:midjametadata@localhost/midjametadatadb';

var client = new pg.Client(connectString);
client.connect(function(err) {
	if(err) {
		return console.error('could not connect to postgres', err);
	}
});

// simply close client when all queries have executed
client.on('drain', function() {
	console.log("query queue has drained!!");
	client.end();
	//client.end.bind(client);
});

var query_datasets = client.query('CREATE TABLE datasets(name VARCHAR PRIMARY KEY, title VARCHAR, author_name VARCHAR, author_email VARCHAR, abstract VARCHAR, publication_date VARCHAR, last_updated_date VARCHAR, organisation VARCHAR(16), source_url VARCHAR, licence VARCHAR, licence_url VARCHAR, geolevel VARCHAR(10), begin_date VARCHAR, end_date VARCHAR, region_column VARCHAR, enabled BOOLEAN)');
query_datasets.on('end', function(err, result) {
	if(err) {
		return console.error('error running query', err);
	}
	console.log("datasets table is ready!");
});

var query_organisations = client.query('CREATE TABLE organisations(name VARCHAR(16) PRIMARY KEY, title VARCHAR, url VARCHAR)');
query_organisations.on('end', function(err, result) {
	if(err) {
		return console.error('error running query', err);
	}
	console.log("organisations table is ready!");
});

var query_attributes = client.query('CREATE TABLE attributes(dataset VARCHAR, attribute VARCHAR, short_desc VARCHAR, long_desc VARCHAR, data_type VARCHAR)');
query_attributes.on('end', function(err, result) {
	if(err) {
		return console.error('error running query', err);
	}
	console.log("attributes table is ready!");
});
