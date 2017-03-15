var express = require('express');
var router = express.Router();
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/images/vendor_images/');
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname)
  }
});
var upload = multer({storage: storage});

//Get custom functions 
//var functions = require('../function');

//Get settings
//var setting = require('../setting');
//var set = setting.notification;

// Models
var Vendor = require('../models/vendor');
var User = require('../models/user');

// vendor add-review
router.post('/add-review', function(req, res){
	var vendor_device_id = req.body.vendor_device_id;
	var user_device_id = req.body.user_device_id;
	var review = req.body.review;
	var rating = req.body.rating;

	if(vendor_device_id == ''){
		res.json({status: false, message: "Vendor Device Id can't be blank."});
	}else if(user_device_id == ''){
		res.json({status: false, message: "User Device Id can't be blank."});
	}else if(review == ''){
		res.json({status: false, message: "Review can't be blank."});
	}else{
		Vendor.ifVendorExist(vendor_device_id, function(err, vendorExist){
			if(vendorExist.length == 0){
				res.json({status:false,message:"Vendor Not Exists!"});
			}else{
				Vendor.ifReviewExist(vendor_device_id, user_device_id, function(err, reviewExist){
					if(reviewExist.length == 0){
						Vendor.addReview(vendor_device_id, user_device_id, review, rating, function(err, review){
							if(err){
								console.log(err);
								res.json({status:false,message:"Something went wrong!"});
							}
							if(review.affectedRows == 1){
								Vendor.updateAvgRating(vendor_device_id, function(err, avgRating){
									res.json({status:true,message:"Review successfully added!"});
								});
							}else{
								res.json({status:false,message:"Something went wrong!"});
							}
						});
					}else{
						Vendor.updateReview(vendor_device_id, user_device_id, review, rating, function(err, review){
							if(err){
								console.log(err);
								res.json({status:false,message:"Something went wrong!"});
							}
							if(review.affectedRows == 1){
								Vendor.updateAvgRating(vendor_device_id, function(err, avgRating){
									res.json({status:true,message:"Review successfully updated!"});
								});
							}
						});
					}
				});
				
			}
		});
	}
});

// vendor get reviews
router.get('/reviews', function(req, res){
	var vendor_device_id = req.body.vendor_device_id;

	// Validation
	if(vendor_device_id == '' || vendor_device_id == undefined){
		res.json({status:false,message:"Vendor Device Id is required!"});
	}else{
		Vendor.ifVendorExist(vendor_device_id, function(err, vendorExist){
			if(vendorExist.length == 0){
				res.json({status:false,message:"Vendor Not Exists!"});
			}else{
				Vendor.getReviews(vendor_device_id, function(err, reviews){
					if(err){
						console.log(err);
						res.json({status:false,message:"Something went wrong!"});
					}
					if(reviews.length == 0){
						res.json({status:true,message:"No reviews found!"});
					}else{
						reviews.forEach(function(value){
							value.image = url+"/"+value.image;
						});
						res.json({status:true,message:"Reviews successfully fetched!",reviews:reviews});
					}
				});
			}
		});
	}
});

// add vendor
router.post('/addVendor', function(req, res){
	var deviceId = req.body.device_id;
	var name = req.body.name;
	var phone_number = req.body.phone_number;
	var fee = req.body.fee;
	var address = req.body.address;
	var timings = req.body.timings;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	var vendorCatInfo = req.body.vendor_categories;

	var uploadImageData = req.body.picture;
	var uploadImageData = JSON.parse(uploadImageData);
    var fileName = req.file.filename;
    var destination = 'images/vendor_images/'+fileName;

	// Validation
	if(deviceId == '' || deviceId == undefined){
		res.json({status:false,message:"Device Id is required!"});
	}else if(name == '' || name == undefined){
		res.json({status:false,message:"Name is required!"});
	}else if(phone_number == '' || phone_number == undefined){
		res.json({status:false,message:"Phone Number is required!"});
	}else if(address == '' || address == undefined){
		res.json({status:false,message:"Address is required!"});
	}else if(timings == '' || timings == undefined){
		res.json({status:false,message:"Timings is required!"});
	}else if(latitude == '' || latitude == undefined){
		res.json({status:false,message:"Latitude is required!"});
	}else if(longitude == '' || longitude == undefined){
		res.json({status:false,message:"Longitude is required!"});
	}

	var errors = req.validationErrors();
	if(errors){
		res.json({status: false, message: "Required fields can't be blank."});
	}else{
		var vendorInfo = {
			device_id: deviceId,
			name: name,
			phone_number: phone_number,
			fee: fee,
			address: address,
			timings: timings,
			latitude: latitude,
			longitude: longitude,
			picture: destination
		};
		Vendor.ifVendorExist(deviceId, function(err, vendorExist){
			if(vendorExist.length == 0){
				Vendor.addVendor(vendorInfo, vendorCatInfo, function(err, vendor){
					res.json({status:true,message:"Thank you for registration, We will proceed your request and will notify you soon."});
				});
			}else{
				Vendor.updateVendor(vendorInfo, vendorCatInfo, function(err, vendor){
					res.json({status:true,message:"Your information updated successfully!"});
				});
			}
		});
	}
});

module.exports = router;