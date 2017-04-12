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

function getCategories() {
        var qry = knex('categories');

        return qry;
}


/* GET categories list */
router.get('/all', function(req, res) {
        getCategories()
        .then(function(rows) {
                if(!rows.length) {
                        // there are no categories
                        res.status(404);
                        res.json({
                                error: 'No categories',
                                errorDescription: 'No categories exist in the database.'
                        });
                } else {
                        var dataset = rows;
                        res.json(dataset);
                }
        });

});


module.exports = router;
