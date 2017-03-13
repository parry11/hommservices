// custom functions - function.js

//Get email configuration
//Get notification configuration
var FCM = require('fcm-push');
var setting = require('./setting');
var set = setting.notification;

module.exports = {
	sendNotification : function sendNotification(device_token, title, body){
		var serverKey = set.serverKey;
		var fcm = new FCM(serverKey);

		var message = {
			to: device_token,
			//collapse_key: 'your_collapse_key', 
			/*data: {
				your_custom_data_key: 'your_custom_data_value'
			},*/
			notification: {
				title: title,
				body: body
			}
		};

		//promise style
		fcm.send(message)
			.then(function(response){
				console.log("Successfully sent with response: ", response);
			})
			.catch(function(err){
				console.log("Something has gone wrong!");
				console.error(err);
			})
	}
}
