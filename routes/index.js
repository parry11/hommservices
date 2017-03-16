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
		Vendor.getVendorCategories(resolution, function(err, vendorCat){
			vendorCat.forEach(function(value){
				vendorCat.push = value;
			});
			if(vendorCat.length > 0){
				vendorCat.forEach(function(value){
					value.category_image = url+value.category_image;
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
router.post('/vendor-listing', function(req, res){
	var category_id = req.body.category_id;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var device_id = req.body.device_id;
	var page = req.body.page;

	// Validation
	if(category_id == '' || category_id == undefined){
		res.json({status:false,message:"Category is required!"});
	}else if(latitude == '' || latitude == undefined){
		res.json({status:false,message:"Latitude is required!"});
	}else if(longitude == '' || longitude == undefined){
		res.json({status:false,message:"Longitude is required!"});
	}else if(page == '' || page == undefined){
		res.json({status:false,message:"Page is required!"});
	}else{
		Vendor.getVendorListingCount(category_id,latitude,longitude, function(err, vendorListCount){
			Vendor.getVendorListingCountPerPage(function(err, perPageCount){
				var recordsToShow = perPageCount[0].value;
				var offset = page * recordsToShow;
				var totPages = Math.ceil(vendorListCount.length/recordsToShow);
				Vendor.getVendorListing(category_id,latitude,longitude,offset,recordsToShow, function(err, vendorList){
					if(err){
						console.log(err);
						res.json({status:false,message:"Something went wrong!"});
					}
					if(vendorList.length > 0){
						vendorList.forEach(function(value){
							value.picture = url+"/"+value.picture;
							value.distance = value.distance.toFixed(2);
							if(value.distance < 1){
								value.distance = value.distance*1000;
							}
						});
						res.json({status:true,message:"Vendor List fetched successfully!",vendorList:vendorList,totPages:totPages});
					}else{
						res.json({status:true,message:"No vendors found!"});
					}
				});
			});
		});
	}
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

module.exports = router;