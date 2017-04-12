var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var organisations = require('./routes/organisations');
var datasets = require('./routes/datasets');
var users = require('./routes/users');
var categories = require('./routes/categories');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', routes);

// organisation, dataset routes
app.use('/organisations', organisations);
app.use('/datasets', datasets);
app.use('/categories', categories);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  err.errorDescription = 'Path ['+req.url +'] not found.';
  next(err);
});

// error handlers

app.use(function(err, req, res, next) {
	errjson = { error: err.message };
	if(app.get('env') === 'development') {
		console.log('ENV(dev)');
		errjson.errorDescription = err.errorDescription;
	}
	res.status(err.status || 500);
	res.json(errjson);
});

/*
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/


module.exports = app;
