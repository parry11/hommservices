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

// get vendor categories
module.exports.getVendorCategories = function(resolution, callback){
	var resolution_image = "category_image_"+resolution;
	var query = "SELECT vendor_category_id,category_name,"+resolution_image+" as category_image FROM vendor_category";
	connection.query(query, callback);
}

// get vendor listing
module.exports.getVendorListing = function(category_id,latitude,longitude,offset,recordsToShow, callback){
	var query = "SELECT v.*,vac.category_id,6371 * ACOS(SIN(RADIANS( "+latitude+" )) * SIN(RADIANS(v.latitude)) + COS(RADIANS( "+latitude+" )) * COS(RADIANS(v.latitude)) * COS(RADIANS(v.longitude) -RADIANS( "+longitude+"))) AS distance, vr.review,vr.rating,vr.created as reviewDate FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.device_id = v.device_id LEFT JOIN vendor_reviews as vr ON v.device_id = vr.vendor_device_id WHERE vac.category_id="+category_id+" HAVING distance <= 50 ORDER BY distance ASC LIMIT "+offset+","+recordsToShow+"";
	//var query = "SELECT v.*,vac.category_id,6371 * ACOS(SIN(RADIANS( "+latitude+" )) * SIN(RADIANS(v.latitude)) + COS(RADIANS( "+latitude+" )) * COS(RADIANS(v.latitude)) * COS(RADIANS(v.longitude) -RADIANS( "+longitude+"))) AS distance FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.device_id = v.device_id WHERE vac.category_id="+category_id+" HAVING distance <= 50 ORDER BY distance ASC LIMIT "+offset+","+recordsToShow+"";
	connection.query(query, callback);
}

// get vendor listing count
module.exports.getVendorListingCount = function(category_id,latitude,longitude, callback){
	var query = "SELECT v.id,6371 * ACOS(SIN(RADIANS( "+latitude+" )) * SIN(RADIANS(v.latitude)) + COS(RADIANS( "+latitude+" )) * COS(RADIANS(v.latitude)) * COS(RADIANS(v.longitude) -RADIANS( "+longitude+"))) AS distance FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.device_id = v.device_id WHERE vac.category_id="+category_id+" HAVING distance <= 50 ORDER BY distance ASC";
	connection.query(query, callback);
}

// if vendor exists
module.exports.ifVendorExist = function(vendor_device_id, callback){
	connection.query("SELECT * FROM vendors WHERE device_id = '"+vendor_device_id+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// if review already exists
module.exports.ifReviewExist = function(vendor_device_id, user_device_id, callback){
	connection.query("SELECT * FROM vendor_reviews WHERE vendor_device_id = '"+vendor_device_id+"' AND user_device_id = '"+user_device_id+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// vendor add review
module.exports.addReview = function(vendor_device_id, user_device_id, review, rating, callback){
	connection.query("INSERT INTO vendor_reviews (vendor_id, user_id, review, rating, created) VALUES ('"+vendor_device_id+"', '"+user_device_id+"', '"+review+"', "+rating+", NOW())", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// vendor update review
module.exports.updateReview = function(vendor_device_id, user_device_id, review, rating, callback){
	connection.query("UPDATE vendor_reviews SET review = '"+review+"', rating = "+rating+" WHERE user_device_id = '"+user_device_id+"' AND user_device_id = '"+user_device_id+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}


// get vendor reviews
module.exports.getReviews = function(vendor_device_id, callback){
	connection.query("SELECT *,DATE_FORMAT(created,'%b %d,%Y') as reviewDate FROM vendor_reviews WHERE vendor_device_id = '"+vendor_device_id+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}


// add vendor
module.exports.addVendor = function(vendorInfo, vendorCatInfo, callback){
	var sql = "INSERT INTO vendors (device_id, name, phone_number, fee, address, timings, picture, latitude, longitude, created) VALUES ('"+vendorInfo.device_id+"', '"+vendorInfo.name+"', '"+vendorInfo.phone_number+"', '"+vendorInfo.fee+"', '"+vendorInfo.address+"', '"+vendorInfo.timings+"', '"+vendorInfo.picture+"', '"+vendorInfo.latitude+"', '"+vendorInfo.longitude+"', NOW())";
	connection.query(sql, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			for(var i in vendorCatInfo){
				var sql1 = "INSERT INTO vendor_assigned_category (device_id, category_id, created) VALUES ('"+vendorInfo.device_id+"', '"+vendorCatInfo[i].category_id+"', NOW())";
				connection.query(sql1);
			}
			callback(null, result);
		}
	});
}

// update vendor
module.exports.updateVendor = function(vendorInfo, vendorCatInfo, callback){
	var sql = "UPDATE vendors SET name = '"+vendorInfo.name+"', phone_number = '"+vendorInfo.phone_number+"' , fee = '"+vendorInfo.fee+"' , address = '"+vendorInfo.address+"' , timings = '"+vendorInfo.timings+"' , picture = '"+vendorInfo.picture+"' , latitude = '"+vendorInfo.latitude+"' , longitude = '"+vendorInfo.longitude+"' WHERE device_id = '"+vendorInfo.device_id+"'";
	connection.query(sql, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			var del = "DELETE FROM vendor_assigned_category WHERE device_id = '"+vendorInfo.device_id+"'";
			connection.query(del);
			for(var i in vendorCatInfo){
				var sql1 = "INSERT INTO vendor_assigned_category (device_id, category_id, created) VALUES ('"+vendorInfo.device_id+"', '"+vendorCatInfo[i].category_id+"', NOW())";
				connection.query(sql1);
			}
			callback(null, result);
		}
	});
}

// update average rating of vendor
module.exports.updateAvgRating = function(vendor_device_id, callback){
	var query = "SELECT AVG(rating) as rating FROM vendor_reviews WHERE vendor_device_id = "+vendor_device_id+"";
	connection.query(query, function(err, rows, fields){
		var query1 = "UPDATE vendors SET rating = "+rows[0].rating+" WHERE vendor_device_id = "+vendor_device_id+"";
		connection.query(query1, function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				callback(null, result);
			}
		});
	});
}

// if device id exist
module.exports.ifDeviceIdExist = function(deviceId, callback){
	var query = "SELECT * FROM settings WHERE device_id = '"+deviceId+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// insert device id and token
module.exports.insertDeviceId = function(deviceId, deviceToken, callback){
	connection.query("INSERT INTO settings (device_id, device_token, created) VALUES ('"+deviceId+"', '"+deviceToken+"', NOW())", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// if token exist
module.exports.ifTokenExist = function(deviceId, deviceToken, callback){
	var query = "SELECT * FROM settings WHERE device_id = '"+deviceId+"' AND device_token = '"+deviceToken+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// insert device token
module.exports.updateDeviceToken = function(deviceId, deviceToken, callback){
	connection.query("UPDATE settings SET device_token = '"+deviceToken+"' WHERE device_id = '"+deviceId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// get vendor listing count per page
module.exports.getVendorListingCountPerPage = function(callback){
	var query = "SELECT value FROM configuration WHERE name='vendor_listing_per_page'";
	connection.query(query, callback);
}