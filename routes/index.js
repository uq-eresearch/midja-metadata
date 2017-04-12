var express = require('express');
var router = express.Router();

var pg = require('pg');
var connectString = 'postgres://midjametadata:midjametadata@midja.org/midjametadatadb'

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.render('index', { title: 'Express' });
	res.json({
		title: 'Express',
		valid_urls: [
			"http://midja.org:3232/organisations",
			"http://midja.org:3232/organisations?sort",
			"http://midja.org:3232/organisations?sort=desc",
			"http://midja.org:3232/organisations/abs",
			"http://midja.org:3232/organisations/abs/datasets",
			"http://midja.org:3232/organisations/abs/datasets?sort",
			"http://midja.org:3232/organisations/abs/datasets?sort=desc",
			"http://midja.org:3232/datasets",
			"http://midja.org:3232/datasets?sort",
			"http://midja.org:3232/datasets?sort=desc",
			"http://midja.org:3232/datasets?all",
			"http://midja.org:3232/datasets?expanded"
		]
	});
});


/* GET the list of datasets */
/*
router.get('/datasets', function(req, res) {
	var results = [];

	whereclause = [];
	sortclause = null;
	if( !('all' in req.query) ) {
		whereclause.push('enabled=true');
	}
	if('sort' in req.query) {
		if(req.query.sort=='asc' || req.query.sort=='') {
			sortclause = ' ORDER BY name';
		} else if(req.query.sort=='desc') {
			sortclause = ' ORDER BY name DESC';
		} else {
			console.log('illegal sort query value: ['+req.query.sort+']');
		}
	}

	// Get a Postgres client from the connection pool
	pg.connect(connectString, function(err, client, done) {

		// SQL Query > Select Data
		var querystr = 'SELECT name, title, enabled FROM datasets';
		if(whereclause.length) {
			querystr += ' WHERE ' + whereclause.join(' and ');
		}
		if(sortclause) {
			querystr += sortclause;
		}
		console.log('querystr===');
		console.log(querystr);
		var query = client.query(querystr);

		// Stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});

		// After all data is returned, close connection and return results
		query.on('end', function() {
			done();
			return res.json(results);
		});

		// Handle Errors
		if(err) {
			console.log(err);
		}
	});

});
*/

/* GET the list of organisations */
/*
router.get('/organisations', function(req, res) {
	var results = [];

	sortclause = null;
	if('sort' in req.query) {
		if(req.query.sort=='asc' || req.query.sort=='') {
			sortclause = ' ORDER BY name';
		} else if(req.query.sort=='desc') {
			sortclause = ' ORDER BY name DESC';
		} else {
			console.log('illegal sort query value: ['+req.query.sort+']');
		}
	}

	// Get a Postgres client from the connection pool
	pg.connect(connectString, function(err, client, done) {

		// SQL Query > Select Data
		var querystr = 'SELECT * from organisations';
		if(sortclause) {
			querystr += sortclause;
		}
		//var query = client.query("SELECT * from organisations ORDER BY name ASC");
		console.log('querystr===');
		console.log(querystr);
		var query = client.query(querystr);

		// Stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});

		// After all data is returned, close connection and return results
		query.on('end', function() {
			done();
			return res.json(results);
		});

		// Handle Errors
		if(err) {
			console.log(err);
		}
	});

});
*/

/* GET a list of datasets for a specific organisation */
/*
router.get('/datasets/:org_name', function(req, res) {
	var results = [];

	whereclause = [];
	sortclause = null;
    // Grab data from the URL parameters
    var org_name = req.params.org_name;
	whereclause.push("organisation=('"+org_name+")");
	if('sort' in req.query) {
		if(req.query.sort=='asc' || req.query.sort=='') {
			sortclause = ' ORDER BY name';
		} else if(req.query.sort=='desc') {
			sortclause = ' ORDER BY name DESC';
		} else {
			console.log('illegal sort query value: ['+req.query.sort+']');
		}
	}

	// Get a Postgres client from the connection pool
	pg.connect(connectString, function(err, client, done) {

		// SQL Query > Select Data
		var query = client.query("SELECT * from datasets WHERE organisation=($1) ORDER BY name ASC", [org_name]);

		// Stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});

		// After all data is returned, close connection and return results
		query.on('end', function() {
			client.end();
			return res.json(results);
		});

		// Handle Errors
		if(err) {
			console.log(err);
		}
	});

});
*/

/* GET metadata for a specific dataset */
/*
router.get('/dataset/:dataset_name', function(req, res) {
	var results = [];

    // Grab data from the URL parameters
    var dataset_name = req.params.dataset_name;
	console.log("req.params===");
	console.log(req.params);
	console.log("req.query===");
	console.log(req.query);

	// Get a Postgres client from the connection pool
	pg.connect(connectString, function(err, client, done) {
		// setup the various parts of the SQL query
		whereclause=[];
		whereclause.push("name=('"+dataset_name+"')");
//		whereclause.push('name=('+dataset_name+')');
		if( !('all' in req.query) ) {
			whereclause.push('enabled=true');
		}

		var newquery = 'SELECT * FROM datasets WHERE ' + whereclause.join(' and ');
		console.log('newquery===');
		console.log(newquery);

		// SQL Query > Select Data
		var query = client.query("SELECT * FROM datasets WHERE name=($1)", [dataset_name]);

		// Stream results back one row at a time
		query.on('row', function(row) {
			console.log('row retrieved:');
			console.log(row);
			results.push(row);
		});

		// After all data is returned, close connection and return results
		query.on('end', function() {
			client.end();
			if('full' in req.query) {
				results[0].attributes_desc = 'to be filled later!';
				results[0].attributes = [ 'one', 'two', 'three'];
			}
			return res.json(results[0]);
		});

		// Handle Errors
		if(err) {
			console.log(err);
		}
	});

});
*/

module.exports = router;
