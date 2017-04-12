var express = require('express');

var expressPromiseRouter = require('express-promise-router');

//var router = express.Router();
var router = expressPromiseRouter();

var errors = require('errors');

var pg = require('pg');
var connectString = 'postgres://midjametadata:midjametadata@midja.org/midjametadatadb'

var knex = require('knex')({
	client: 'pg',
	connection: connectString
});

/*
 * These routes are mounted on /organisations (see app.js in ROOT)
 */

/* GET the list of organisations */
router.get('/', function(req, res) {
	var qry = knex('organisations');

	if('sort' in req.query) {
		if(req.query.sort=='asc' || req.query.sort=='') {
			qry = qry.orderBy('name');
		} else if(req.query.sort=='desc') {
			qry = qry.orderBy('name', 'desc');
		} else {
			console.log('illegal sort query value: ['+req.query.sort+']');
		}
	}

	qry.then(function(rows) {
		console.log('rows===');
		console.log(rows);
		res.json(rows);
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


/* build query for retrieving an organisation */
function getOrganisation(orgname) {
	var qry = knex('organisations');
	if(typeof orgname === 'string') {
		qry = qry.where('name', orgname);
	}

	return qry;
}


/* build query to retrieve datasets for an organisation */
function getDatasetsForOrg(orgname, sort) {
	var qry = knex('datasets')
		.select('name', 'title', 'enabled')
		.where('organisation', orgname);

	if(sort==='asc' || sort==='') {
		qry = qry.orderBy('name');
	} else if(sort==='desc') {
		qry = qry.orderBy('name', 'desc');
	} else {
		console.log('illegal sort query value: ['+sort+']');
	}

	return qry;
}


/* GET metadata for a specific organisation */
router.get('/:org_name', function(req, res) {
	var org_name = req.params.org_name;

	getOrganisation(org_name)
	.then(function(rows) {
		if(!rows.length) {
			// there is no org!
			res.status(404);
			res.json({
				error: 'No such organisation',
				errorDescription: 'The organisation ['+org_name+'] does not exist.'
			});
		} else {
			res.json(rows[0]);
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


/* GET datasets list for a specific organisation */
router.get('/:org_name/datasets', function(req, res) {
	var org_name = req.params.org_name;

	getOrganisation(org_name)
	.then(function(rows) {
		if(!rows.length) {
			// there is no org!
			res.status(404);
			res.json({
				error: 'No such organisation',
				errorDescription: 'The organisation ['+org_name+'] does not exist.'
			});
		} else {
			getDatasetsForOrg(org_name, req.query.sort)
			.then(function(datasets) {
				console.log('datasets found===');
				console.log(datasets);
				res.json(datasets);
			});
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


module.exports = router;
