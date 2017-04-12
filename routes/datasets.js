var express = require('express');

var expressPromiseRouter = require('express-promise-router');

//var router = express.Router();
var router = expressPromiseRouter();

var pg = require('pg');
var connectString = 'postgres://midjametadata:midjametadata@midja.org/midjametadatadb'

var knex = require('knex')({
	client: 'pg',
	connection: connectString
});

var Promise = require('bluebird');
// Object.assign is unavailable everywhere :'(
var ObjAssign = Object.assign || require('object.assign');

/*
 * These routes are mounted on /datasets (see app.js in ROOT)
 */

/* GET the list of datasets */
router.get('/', function(req, res) {
	var qry = knex('datasets');

	if( !('all' in req.query) ) {
		qry = qry.where('enabled', true);
	}
	if('sort' in req.query) {
		if(req.query.sort=='asc' || req.query.sort=='') {
			qry = qry.orderBy('name');
		} else if(req.query.sort=='desc') {
			qry = qry.orderBy('name', 'desc');
		} else {
			console.log('illegal sort query value: ['+req.query.sort+']');
		}
	}

	qry.then(function(datasets) {
		if('expanded' in req.query) {
			Promise.all(
				datasets.map(function(dataset) {
					return getAttributesForDataset(dataset.name)
					.then(function(attrs) {
						var dataset_with_attrs = ObjAssign({}, dataset, { attributes: attrs });
						return dataset_with_attrs;
					});
				})
			).then(function(datasets_with_attrs) {
				res.json(datasets_with_attrs);
			});
		} else {
			res.json(datasets);
		}
	})
	.catch(function(e) {
		console.log('error :-[');
		console.log(e);
		res.status(500);
		res.json({
			error: 'server side error',
			errorDescription: e.error
		});
	});

});


function getDataset(datasetname) {
	var qry = knex('datasets')
		.where('name', datasetname);

	return qry;
}

function getAttributesForDataset(datasetname, sort) {
	var qry = knex('attributes')
		.select('attribute as name', 'short_desc', 'long_desc', 'data_type', 'cat_id')
		.where('dataset', datasetname);

	return qry;
}


/* GET metadata for a specific dataset */
router.get('/:dataset_name', function(req, res) {
	var dataset_name = req.params.dataset_name;

	getDataset(dataset_name)
	.then(function(rows) {
		if(!rows.length) {
			// there is no dataset!
			res.status(404);
			res.json({
				error: 'No such dataset',
				errorDescription: 'The dataset ['+dataset_name+'] does not exist.'
			});
		} else {
			var dataset = rows[0];

			if('expanded' in req.query) {
				getAttributesForDataset(dataset_name)
				.then(function(attributes) {
					dataset.attributes = attributes;
					res.json(dataset);
				});
			} else {
				res.json(dataset);
			}
		}
	});

});


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


module.exports = router;
