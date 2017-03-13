var express = require('express');
var router = express.Router();
//var FCM = require('fcm-push');

// Models
var User = require('../models/user');
var Vendor = require('../models/vendor');

// vendor category api
router.post('/vendor-categories', function(req, res){
	var deviceId = req.body.device_id;
	var resolution = typeof req.body.resolution == typeof undefined ? '' : req.body.resolution;
	var deviceToken = typeof req.body.device_token == typeof undefined ? '' : req.body.device_token;
	
	if(resolution != 'hdpi' || resolution != 'mdpi' || reolution != 'xhdpi' || resolution != 'xxhdpi' || resolution != 'xxxhdpi'){
		resolution = 'xxxhdpi';
	}
	if(deviceId == '' || deviceId == undefined){
		res.json({status:false,message:"Device Id is required!"});
	}else{
		Vendor.ifDeviceIdExist(deviceId, function(err, deviceIdExist){
			if(err){
				console.log(err);
				res.json({status:false,message:"Something went wrong!"});
			}
			if(deviceIdExist.length == 0){
				Vendor.insertDeviceId(deviceId, deviceToken, function(err){
					if(err){
						console.log(err);
						res.json({status:false,message:"Something went wrong!"});
					}
				});
			}else{
				if(deviceToken != ''){
					Vendor.ifTokenExist(deviceId, deviceToken, function(err, tokenExist){
						if(tokenExist.length == 0){
							Vendor.updateDeviceToken(deviceId, deviceToken, function(err){
								if(err){
									console.log(err);
									res.json({status:false,message:"Something went wrong!"});
								}
							});
						}
					});
				}
			}
		});
		Vendor.getMobileVendorCategories(resolution, function(err, vendorCat){
			vendorCat.forEach(function(value){
				vendorCat.push = value;
			});
			if(vendorCat.length > 0){
				vendorCat.forEach(function(value){
					value.category_image = url+"/"+value.category_image;
				});
			}
			if(err){
				console.log(err);
				res.json({status:false,message:"Something went wrong!"});
			}
			if(vendorCat.length > 0){
				res.json({status:true,message:"Vendor Categories fetched successfully!",vendorCat:vendorCat});
			}else{
				res.json({status:true,message:"No category found!"});
			}
		});
	}
});

// vendor listing api
router.get('/vendor-listing/:cat_id/:range/:page/:loc_id*?', function(req, res){
	var catId = req.params.cat_id;
	var uid = req.params[0].substring(1);
	var range = req.params.range;
	var page = req.params.page;
	var loc = req.params.loc_id;
	var minRange,maxRange;
	if(range == '-1'){
		minRange = -1;
		maxRange = -1;
	}
	if(range == '0-30'){
		minRange = 0;
		maxRange = 30000;
	}
	if(range == '30-50'){
		minRange = 30000;
		maxRange = 50000;
	}
	if(range == '50-80'){
		minRange = 50000;
		maxRange = 80000;
	}
	if(range == '80+'){
		minRange = 80000;
		maxRange = -1;
	}
	var minRange = parseFloat(minRange);
	var maxRange = parseFloat(maxRange);
	var userFavVen = [];
	var userShortVen = [];
	Vendor.getFavVendorsByUser(uid, function(err, userFavVendorList){
		userFavVendorList.forEach(function(val){
			userFavVen.push(val.vendor_id);
		});
		Vendor.getShortlistVendorsByUser(uid, function(err, userShortlistVendorList){
			userShortlistVendorList.forEach(function(val){
				userShortVen.push(val.vendor_id);
			});
			Vendor.getMobileVendorListingCount(catId,minRange,maxRange,loc, function(err, vendorListCount){
				Vendor.getVendorListingCountPerPage(function(err, perPageCount){
					var recordsToShow = perPageCount[0].value;
					var offset = page * recordsToShow;
					var totPages = Math.ceil(vendorListCount[0].vendorCount/recordsToShow);
					Vendor.getMobileVendorListing(catId,minRange,maxRange,offset,recordsToShow, loc, function(err, vendorList){
						if(vendorList.length > 0){
							vendorList.forEach(function(value){
								value.is_favorite = 0;
								value.is_shortlist = 0;
								if(userFavVen.indexOf(value.vendor_id) !== -1){
									value.is_favorite = 1;
								}
								if(userShortVen.indexOf(value.vendor_id) !== -1){
									value.is_shortlist = 1;
								}
								value.vendor_image = url+"/"+value.vendor_image;
							});
						}
						if(err){
							console.log(err);
							res.json({status:false,message:"Something went wrong!"});
						}
						if(vendorList.length > 0){
							res.json({status:true,message:"Vendor List fetched successfully!",vendorList:vendorList,totPages:totPages});
						}else{
							res.json({status:true,message:"No vendors found!"});
						}
					});
				});
			});
		});
	});
});

// feedback api
router.post('/feedback', function(req, res) {
	var deviceId = req.body.device_id;
	var feedback = req.body.feedback;

	// Validation
	if(deviceId == '' || deviceId == undefined){
		res.json({status:false,message:"Device Id is required!"});
	}else if(feedback == '' || feedback == undefined){
		res.json({status:false,message:"Feedback is required!"});
	}else{
		User.getFeedback(deviceId, function(err, fdb){
			if(fdb.length > 0){
				var fdb = {
					device_id: deviceId,
					feedback: feedback
				};
				User.updateFeedback(fdb, function(err, feed){
					if(err){
						console.log(err);
						res.json({status:false,message:"Something went wrong!"});
					}
					if(feed.affectedRows){
						res.json({status:true,message:"Feedback updated!"});
					}
				})
			}else{
				var fdb = {
					device_id: deviceId,
					feedback: feedback
				};
				User.addFeedback(fdb, function(err, feed){
					if(err){
						console.log(err);
						res.json({status:false,message:"Something went wrong!"});
					}
					if(feed.affectedRows == 1){
						res.json({status:true,message:"Feedback added!"});
					}
				})
			}
		});
	}
});

// update settiings
router.post('/settings', function(req, res) {
	var deviceId = req.body.device_id;
	var notification = req.body.notification;

	// Validation
	if(deviceId == '' || deviceId == undefined){
		res.json({status:false,message:"Device Id is required!"});
	}else if(notification == '' || notification == undefined){
		res.json({status:false,message:"Notification is required!"});
	}else{
		var sett = {
			device_id: deviceId,
			notification: notification
		};
		User.updateSettings(sett, function(err, setting){
			if(err){
				console.log(err);
				res.json({status:false,message:"Something went wrong!"});
			}
			if(setting.affectedRows == 1){
				res.json({status:true,message:"Settings updated successfully!"});
			}else{
				res.json({status:false,message:"No settings found!"});
			}
		});
	}
});

// get settiings
router.post('/get_Settings', function(req, res) {
	var deviceId = req.body.device_id;

	// Validation
	if(deviceId == '' || deviceId == undefined){
		res.json({status:false,message:"Device Id is required!"});
	}else{
		User.getSettings(deviceId, function(err, setting){
			if(err){
				console.log(err);
				res.json({status:false,message:"Something went wrong!"});
			}
			if(setting.length == 1){
				setting.forEach(function(value){
					setting = value;
				});
				res.json({status:true,message:"Settings updated successfully!",settings:setting});
			}else{
				res.json({status:false,message:"No settings found!"});
			}
		});
	}
});

/*router.get('/notification', function(req, res){
	var serverKey = 'AAAACTw6354:APA91bFQsaIRqB3qV_DyTYcJPa15JFWN3fONvjLy2Y8vLi9RKxRLnQTEqXUUhFUg9wfdq6WUusggzYrW5o-09nTvkm5iLQuYha25D1unqp9XT_k4q5ITh3_rC2QeuIl5DRCLyLcEo3al3sgLnPIqiMR2yiPgDtV8fw';
	var fcm = new FCM(serverKey);

	var message = {
		to: 'fkxwtH0uw6M:APA91bFg3LC61aMWd3cM_N_7RMIqagqVjitnLf6o1T1TMDFVI7LgsR4uzCYkVPxPidYuUlZw5N_WK8BtkpneymFmgWEFRUN5H7n4RrFyBayb0jTwe2vF-pHBo91_ja6UvD9ojtGNzj_h',
		//collapse_key: 'your_collapse_key', 
		notification: {
			title: 'Vendor Shortlist Test',
			body: 'You are shortlisted by a user'
		}
	};

	//callback style
	fcm.send(message, function(err, response){
		if (err) {
			console.log("Something has gone wrong!");
			console.error(err);
		} else {
			console.log("Successfully sent with response: ", response);
		}
	});

	//promise style
	fcm.send(message)
		.then(function(response){
			console.log("Successfully sent with response: ", response);
		})
		.catch(function(err){
			console.log("Something has gone wrong!");
			console.error(err);
		})
});*/ 
module.exports = router;