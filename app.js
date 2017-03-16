var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mysql = require('mysql');
var multer  = require('multer')

//global.url = 'http://localhost:4000';
global.url = 'http://52.33.209.165:5000';

var config = require('./mysql');
var db = config.database;
var connection = mysql.createConnection({
	// properties...
	host: db.host,
	user: db.user,
	password: db.password,
	database: db.database
});
connection.connect(function(error){
	if(!!error){
		console.log('Error');
	}else{
		console.log('connected');
	}
});

var routes = require('./routes/index');
var vendors = require('./routes/vendors');

var Vendor = require('./models/vendor');

// Init App
var app = express();

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg	  : msg,
			value : value
		};
	}
}));

app.use('/', routes);
app.use('/vendors', vendors);

// Set Port
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});