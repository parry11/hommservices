var mysql = require('mysql');

var config = require('../mysql');
var db = config.database;
var connection = mysql.createConnection({
	// properties...
	host: db.host,
	user: db.user,
	password: db.password,
	database: db.database
});

// get feedback by device id
module.exports.getFeedback = function(deviceId, callback){
	var query = "SELECT * FROM feedback WHERE device_id = '"+deviceId+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// add feedback
module.exports.addFeedback = function(fdb, callback){
	connection.query("INSERT INTO feedback (device_id, feedback, created) VALUES ('"+fdb.device_id+"', '"+fdb.feedback+"', NOW())", callback);
}

// update feedback
module.exports.updateFeedback = function(fdb, callback){
	connection.query("UPDATE feedback SET feedback = '"+fdb.feedback+"' WHERE device_id = '"+fdb.device_id+"'", callback);
}

// update settings
module.exports.updateSettings = function(sett, callback){
	connection.query("UPDATE settings SET push_notification = "+sett.notification+" WHERE device_id = '"+sett.device_id+"'", callback);
}

// get settings
module.exports.getSettings = function(deviceId, callback){
	connection.query("SELECT notification FROM settings WHERE device_id = '"+deviceId+"'", callback);
}