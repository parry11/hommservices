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
var functions = require('../function');

//Get settings
var setting = require('../setting');
var set = setting.notification;

// Models
var Vendor = require('../models/vendor');
var User = require('../models/user');

// vendor add-review
router.post('/add-review', function(req, res){
	var device_id = req.body.device_id;
	var review = req.body.review;
	var rating = req.body.rating;

	if(vendor_id == ''){
		res.json({status: false, message: "Vendor Id can't be blank."});
	}else if(device_id == ''){
		res.json({status: false, message: "Device Id can't be blank."});
	}else if(review == ''){
		res.json({status: false, message: "Review can't be blank."});
	}else{
		Vendor.ifVendorExist(vendor_id, function(err, vendorExist){
			if(vendorExist.length == 0){
				res.json({status:false,message:"Vendor Not Exists!"});
			}else{
				Vendor.ifUserExist(device_id, function(err, userExist){
					if(userExist.length == 0){
						res.json({status:false,message:"User Not Exists!"});
					}else{
						Vendor.ifReviewExist(vendor_id, device_id, function(err, reviewExist){
							if(reviewExist.length == 0){
								Vendor.addReview(vendor_id, device_id, review, rating, function(err, review){
									if(err){
										console.log(err);
										res.json({status:false,message:"Something went wrong!"});
									}
									if(review.affectedRows == 1){
										Vendor.updateAvgRating(vendor_id, function(err, avgRating){
											res.json({status:true,message:"Review successfully added!"});
										});
									}else{
										res.json({status:false,message:"Something went wrong!"});
									}
								});
							}else{
								Vendor.updateReview(vendor_id, device_id, review, rating, function(err, review){
									if(err){
										console.log(err);
										res.json({status:false,message:"Something went wrong!"});
									}
									if(review.affectedRows == 1){
										Vendor.updateAvgRating(vendor_id, function(err, avgRating){
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
	}
});

// vendor get reviews
router.get('/reviews/:vendorId', function(req, res){
	var vendor_id = req.params.vendorId;

	if(vendor_id == ''){
		res.json({status: false, message: "Vendor Id can't be blank."});
	}else{
		Vendor.ifVendorExist(vendor_id, function(err, vendorExist){
			if(vendorExist.length == 0){
				res.json({status:false,message:"Vendor Not Exists!"});
			}else{
				Vendor.getReviews(vendor_id, function(err, reviews){
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
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;

	// Validation
	if(deviceId == '' || deviceId == undefined){
		res.json({status:false,message:"Device Id is required!"});
	}else if(name == '' || name == undefined){
		res.json({status:false,message:"Name is required!"});
	}
	req.checkBody('name', 'Vendor Title is required').notEmpty();
	req.checkBody('phone_number', 'Phone Number is required').notEmpty();
	req.checkBody('fee', 'Fee is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('latitude', 'Latitude is required').notEmpty();
	req.checkBody('longitude', 'Longitude is required').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		res.json({status: false, message: "Required fields can't be blank."});
	}else{
		var now = new Date();
		var date = dateFormat(now, 'yyyy-mm-dd HH:mm:ss');

		var vendorInfo = {
			name: name,
			phone_number: phone_number,
			fee: fee,
			address: address,
			start_time: start_time,
			end_time: end_time,
			latitude: latitude,
			longitude: longitude,
			created: date
		};
		Vendor.ifVendorExist(vendor_id, function(err, vendorExist){
			if(vendorExist.length == 0){
				Vendor.addVendor(vendorInf, function(err, vendor){
					res.json({status:true,message:"Your information added successfully!","vendor":ven});
				});
			}else{
				Vendor.updateVendor(vendorInfo, function(err, vendor){
					Vendor.getVendorById(vendor_id, function(err, ven){
						res.json({status:true,message:"Your information updated successfully!","vendor":ven});
					});
				});
			}
		});
	}
});

// vendor info page
router.get('/info/:slug', function(req, res){
	if(req.user && req.user[0].user_type == 2){
		var slug = req.params.slug;
		User.getUserBySlug(slug, function(err, user){
			user.forEach(function(value){
				user = value;
			});
			Vendor.getAllVendorCategories(function(err, vendorCat){
				Vendor.getVendorById(user.id, function(err, vendorInfo){
					vendorInfo.forEach(function(value){
						vendorInfo = value;
					});
					Vendor.getAssignedCategories(user.id, function(err,vendorInfoCats){
						var vcatIds = '';
						var onlyVenCats = [];
						vendorInfoCats.forEach(function(value){
							vcatIds += value.category_id+',';
							onlyVenCats.push(value.category_id);
						});
						vcatIds = vcatIds.substring(0,(vcatIds.length-1));
						Vendor.getAlbums(user.id, function(err, albums){
							Vendor.getVendorPromotions(user.id, function(err, promotions){
								Event.getLocations(function(err, locations){
									locations.forEach(function(value){
										value.selected = vendorInfo.vendor_location;
									});
									vendorCat.forEach(function(value){
										if(onlyVenCats.indexOf(value.vendor_category_id) !== -1){
											value.is_assigned = 1;
										}else{
											value.is_assigned = 0;
										}
									});
									Vendor.getPopularVendors(function(err, popVen){
										User.getConfigurationSettings(function(err, conf){
											var myConf = {};
											conf.forEach(function(value){
												myConf[value.name] = value.value;
											});
											albums.forEach(function(value){
												value.images_per_album = myConf.image_per_album;
												if(value.images != null){
													value.img = value.images.split(',');
													for(var i = 0; i < value.img.length; i++){
														value.img[i] = value.img[i]+':'+value.id;
													}
													if(value.img.length < myConf.image_per_album){
														for(var i = (value.img.length + 1); i <= myConf.image_per_album; i++){
															value.img[i] = 'images/album_box.png:'+value.id;
														}
													}
												}else{
													value.img = {};
													for(var i = 0; i < myConf.image_per_album; i++){
														value.img[i] = 'images/album_box.png:'+value.id;
													}
												}
											});
											res.render('vendors/info', { layout: 'vendor', 'vendor': user, 'categories': vendorCat, 'vendorinfo': vendorInfo, 'vendorCats': vendorInfoCats, 'vendorCatsCount': vendorInfoCats.length, 'vCats': vcatIds, 'onlyVCats': onlyVenCats, 'albums': albums, 'albumCount': albums.length, 'promotions': promotions, 'promotionCount': promotions.length, 'locations': locations,'popVen': popVen, 'conf': myConf });
										});
									});
								});
							});
						})
					});
				})
			});
		});
	}else{
		res.redirect(url);
	}

});

module.exports = router;