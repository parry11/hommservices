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


// get vendor by vendor_id
module.exports.getVendorById = function(vendor_id, callback){
	var query = "SELECT v.*, l.location FROM vendors as v LEFT JOIN locations as l ON v.vendor_location = l.id WHERE v.vendor_id = '"+vendor_id+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get vendor categories for mobile
module.exports.getMobileVendorCategories = function(resolution, callback){
	var resolution_image = "category_image_"+resolution;
	var query = "SELECT vendor_category_id,category_name,"+resolution_image+" as category_image FROM vendor_category";
	connection.query(query, callback);
}

// if login user like the vendor
module.exports.ifLoginUserFavorite = function(vendorId, userId, callback){
	var query = "SELECT * FROM vendor_favorite WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'";
	connection.query(query, callback);
}

// get favorite vendor by user
module.exports.getFavVendorsByUser = function(userId, callback){
	var query = "SELECT * FROM vendor_favorite WHERE user_id = '"+userId+"'";
	connection.query(query, callback);
}


// get vendor categories for web
module.exports.getVendorCategories = function(callback){
	var query = "SELECT vc.* FROM vendor_category as vc, vendor_assigned_category as vac WHERE vc.vendor_category_id = vac.category_id group by vc.vendor_category_id";
	//var query = "SELECT vendor_category_id,category_name,category_slug,category_icon FROM vendor_category";
	connection.query(query, callback);
	/*var res = new Array();
	connection.query(query, function(err, rows, fields){
		if(err) throw err;
		for(var i = 0; i< rows.length; i++){
			//console.log(rows[i]['vendor_category_id']);
			res[i] = rows[i]['vendor_category_id'];
			var query1 = "SELECT v.* FROM vendor_assigned_category as vc LEFT JOIN vendors as v ON vc.vendor_id = v.vendor_id WHERE vc.category_id = "+rows[i]['vendor_category_id']+"";
			connection.query(query1, function(err, rows1, fields1){
				//console.log(rows1);
				res[i] = rows1;
				//for(var j = 0; j < rows1.length; j++){
					//res[i] = rows1[j];
					//console.log(rows1[j]);
				//}
				console.log(res);
			});
		}
	});*/
}

// get vendors by categories wise for web
/*module.exports.getVendorsByCategories = function(cats, callback){
		var query = "SELECT v.* FROM vendor_assigned_category as vc LEFT JOIN vendors as v ON vc.vendor_id = v.vendor_id WHERE vc.category_id = "+cats[i]+"";
		connection.query(query, function(err, rows, fields){
			vends[cats[i]] = rows;
		});
	}
	console.log(vends);
}*/

// get vendor categories for web
module.exports.getVendors = function(callback){
	var query = "SELECT * FROM vendors";
	connection.query(query, callback);
}

// get vendor listing for mobile
module.exports.getMobileVendorListing = function(catId,minRange,maxRange,offset,recordsToShow,loc, callback){
	if(minRange != -1 && maxRange != -1){
		if(loc == 0){
			var query = "SELECT v.*,vac.category_id,vac.min_price,vac.max_price,l.location FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE vac.category_id="+catId+" AND (vac.min_price >= "+minRange+" AND max_price <= "+maxRange+") LIMIT "+offset+","+recordsToShow+"";
		}else{
			var query = "SELECT v.*,vac.category_id,vac.min_price,vac.max_price,l.location FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE vac.category_id="+catId+" AND (vac.min_price >= "+minRange+" AND max_price <= "+maxRange+") AND v.vendor_location = "+loc+" LIMIT "+offset+","+recordsToShow+"";
		}
	}
	if(minRange == 80000 && maxRange == -1){
		if(loc == 0){
			var query = "SELECT v.*,vac.category_id,vac.min_price,vac.max_price,l.location FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE vac.category_id="+catId+" AND vac.min_price >= "+minRange+" LIMIT "+offset+","+recordsToShow+"";
		}else{
			var query = "SELECT v.*,vac.category_id,vac.min_price,vac.max_price,l.location FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE vac.category_id="+catId+" AND vac.min_price >= "+minRange+" AND v.vendor_location = "+loc+" LIMIT "+offset+","+recordsToShow+"";
		}
	}
	if(minRange == -1 && maxRange == -1){
		if(loc == 0){
			var query = "SELECT v.*,vac.category_id,vac.min_price,vac.max_price,l.location FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE vac.category_id="+catId+" LIMIT "+offset+","+recordsToShow+"";
		}else{
			var query = "SELECT v.*,vac.category_id,vac.min_price,vac.max_price,l.location FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE vac.category_id="+catId+" AND v.vendor_location = "+loc+" LIMIT "+offset+","+recordsToShow+"";
		}
	}
	connection.query(query, callback);
}

// get vendor listing count for mobile
module.exports.getMobileVendorListingCount = function(catId,minRange,maxRange,loc, callback){
	if(minRange != -1 && maxRange != -1){
		if(loc == 0){
			var query = "SELECT COUNT(*) as vendorCount FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id WHERE vac.category_id="+catId+" AND (vac.min_price >= "+minRange+" AND max_price <= "+maxRange+")";
		}else{
			var query = "SELECT COUNT(*) as vendorCount FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id WHERE vac.category_id="+catId+" AND (vac.min_price >= "+minRange+" AND max_price <= "+maxRange+") AND v.vendor_location = "+loc+"";
		}
	}
	if(minRange == 80000 && maxRange == -1){
		if(loc == 0){
			var query = "SELECT count(*) as vendorCount FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id WHERE vac.category_id="+catId+" AND vac.min_price >= "+minRange+"";
		}else{
			var query = "SELECT count(*) as vendorCount FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id WHERE vac.category_id="+catId+" AND vac.min_price >= "+minRange+" AND v.vendor_location = "+loc+"";
		}
	}
	if(minRange == -1 && maxRange == -1){
		if(loc == 0){
			var query = "SELECT count(*) as vendorCount FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id WHERE vac.category_id="+catId+"";
		}else{
			var query = "SELECT count(*) as vendorCount FROM vendor_assigned_category as vac LEFT JOIN vendors as v ON vac.vendor_id = v.vendor_id WHERE vac.category_id="+catId+" AND v.vendor_location = "+loc+"";
		}
	}
	connection.query(query, callback);
}

// get category id by slug
module.exports.getCategoryBySlug = function(slug, callback){
	var query = "SELECT vendor_category_id FROM vendor_category WHERE category_slug='"+slug+"'";
	connection.query(query, function(err, result){
		if(err) {
			console.log(err);
			callback(err, null);
		}else {
			//console.log(result);
			callback(null, result[0].vendor_category_id);
		}
	});
}

// get vendors by vendor category id
module.exports.getVendorsByCatId = function(catId, callback){
	var query = "SELECT v.*,vc.min_price,vc.max_price,l.location from vendors as v LEFT JOIN vendor_assigned_category as vc ON vc.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE vc.category_id="+catId+" ORDER BY v.vendor_id ASC LIMIT 0,10";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// vendor make favorite
module.exports.makeFavorite = function(vendorId, userId, callback){
	connection.query("INSERT INTO vendor_favorite (vendor_id, user_id, created) VALUES ('"+vendorId+"', '"+userId+"',  NOW())", function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				//console.log(result);
				callback(null, result);
			}
	});
}

// vendor already favorite
module.exports.alreadyFavorite = function(vendorId, userId, callback){
	connection.query("SELECT * FROM vendor_favorite WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				//console.log(result);
				callback(null, result);
			}
	});
}

// vendor remove favorite
module.exports.removeFavorite = function(vendorId, userId, callback){
	connection.query("DELETE FROM vendor_favorite WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				//console.log(result);
				callback(null, result);
			}
	});
}

// if vendor exists
module.exports.ifVendorExist = function(vendorId, callback){
	connection.query("SELECT * FROM vendors WHERE vendor_id = '"+vendorId+"'", function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				//console.log(result);
				callback(null, result);
			}
	});
}

// if user exists
module.exports.ifUserExist = function(userId, callback){
	connection.query("SELECT * FROM users WHERE id = '"+userId+"'", function(err, result){
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
module.exports.ifReviewExist = function(vendorId, userId, callback){
	connection.query("SELECT * FROM vendor_reviews WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
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
module.exports.addReview = function(vendorId, userId, review, rating, callback){
	connection.query("INSERT INTO vendor_reviews (vendor_id, user_id, review, rating, created) VALUES ('"+vendorId+"', '"+userId+"', '"+review+"', "+rating+", NOW())", function(err, result){
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
module.exports.updateReview = function(vendorId, userId, review, rating, callback){
	connection.query("UPDATE vendor_reviews SET review = '"+review+"', rating = "+rating+" WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
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
module.exports.getReviews = function(vendorId, callback){
	connection.query("SELECT vendor_reviews.*,users.name,users.image,DATE_FORMAT(vendor_reviews.created,'%b %d,%Y') as reviewDate FROM vendor_reviews LEFT JOIN users ON vendor_reviews.user_id = users.id WHERE vendor_id = '"+vendorId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

//get vendor detail by slug
module.exports.getVendorBySlug = function(slug, callback){
	connection.query("SELECT v.*,l.location FROM vendors as v LEFT JOIN locations as l ON v.vendor_location = l.id WHERE vendor_slug = '"+slug+"'", function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				//console.log(result);
				callback(null, result[0]);
			}
	});
}

//if is favorite
module.exports.isFavorite = function(vendorId, userId, callback){
	connection.query("SELECT * FROM vendor_favorite WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// vendor already shortlist
module.exports.alreadyShortlist = function(vendorId, userId, eventId, callback){
	connection.query("SELECT * FROM vendor_shortlist WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"' AND event_id = '"+eventId+"'", function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				//console.log(result);
				callback(null, result);
			}
	});
}

// vendor remove shortlist
module.exports.removeShortlist = function(vendorId, userId, eventId, callback){
	//connection.query("DELETE FROM vendor_shortlist WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"' AND event_id = '"+eventId+"'", function(err, result){
	connection.query("DELETE FROM vendor_shortlist WHERE vendor_id = '"+vendorId+"' AND event_id = '"+eventId+"'", function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				//console.log(result);
				callback(null, result);
			}
	});
}

// vendor make shortlist
module.exports.makeShortlist = function(vendorId, userId, eventId, callback){
	var now = new Date();
	var date = dateFormat(now, 'yyyy-mm-dd HH:mm:ss');
	var sql = "INSERT INTO vendor_shortlist (vendor_id, user_id, event_id, created) VALUES ?";
	var values = [];
	eventId.forEach(function(value){
		val = [vendorId,userId,value,date];
		values.push(val);
	});
	connection.query(sql, [values], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}



//if is shortlist
module.exports.isShortlist = function(vendorId, userId, callback){
	connection.query("SELECT * FROM vendor_shortlist WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

//get events that have shortlisted vendor
module.exports.getEventsHaveShortlistVendors = function(vendorId, userId, callback){
	connection.query("SELECT event_id FROM vendor_shortlist WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

//get events that have finalized vendor
module.exports.getEventsHaveFinalizeVendors = function(vendorId, userId, callback){
	connection.query("SELECT event_id FROM vendor_finalize WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

//get events that have finalized vendor
module.exports.getEventsHaveFinalizeVendors = function(vendorId, userId, callback){
	connection.query("SELECT event_id FROM vendor_finalize WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// get shortlist vendor by user
module.exports.getShortlistVendorsByUser = function(userId, callback){
	var query = "SELECT * FROM vendor_shortlist WHERE user_id = '"+userId+"'";
	connection.query(query, callback);
}

// get my events
module.exports.myEvents = function(userId, colEvents, callback){
	if(colEvents.length > 0){
		var query = "SELECT *, FROM_UNIXTIME(event_start_time/1000,'%b %d,%Y %r') as eventDate FROM events LEFT JOIN event_category ON events.event_type = event_category.id WHERE user_id = '"+userId+"' AND events.event_end_time >= UNIX_TIMESTAMP(UTC_TIMESTAMP())*1000 OR events.event_id IN ("+colEvents+") order by events.created DESC";
	}else{
		var query = "SELECT *, FROM_UNIXTIME(event_start_time/1000,'%b %d,%Y %r') as eventDate FROM events LEFT JOIN event_category ON events.event_type = event_category.id WHERE user_id = '"+userId+"' AND events.event_end_time >= UNIX_TIMESTAMP(UTC_TIMESTAMP())*1000 order by events.created DESC";
	}
	connection.query(query, callback);
}

// get shortlist vendors
module.exports.getShortListVendors = function(userId, eventId, callback){
	//connection.query("SELECT v.*,l.location FROM vendor_shortlist as vs INNER JOIN vendors as v ON vs.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE user_id = '"+userId+"' AND event_id = '"+eventId+"'", function(err, result){
	connection.query("SELECT v.*,l.location FROM vendor_shortlist as vs INNER JOIN vendors as v ON vs.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE event_id = '"+eventId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			//console.log(result);
			callback(null, result);
		}
	});
}

// vendor make finalize
module.exports.makeFinalize = function(vendorId, userId, eventId, callback){
	var now = new Date();
	var date = dateFormat(now, 'yyyy-mm-dd HH:mm:ss');
	var sql = "INSERT INTO vendor_finalize (vendor_id, user_id, event_id, created) VALUES ?";
	var values = [[vendorId,userId,eventId,date]];

	connection.query(sql, [values], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// vendor unfinalize
module.exports.unFinalize = function(vendorId, userId, eventId, callback){
	//connection.query("DELETE FROM vendor_finalize WHERE vendor_id = '"+vendorId+"' AND user_id = '"+userId+"' AND event_id = '"+eventId+"'", function(err, result){
	connection.query("DELETE FROM vendor_finalize WHERE vendor_id = '"+vendorId+"' AND event_id = '"+eventId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get finalized vendors
module.exports.getFinalizedVendors = function(userId, eventId, callback){
	//connection.query("SELECT v.*,l.location FROM vendor_finalize as vf INNER JOIN vendors as v ON vf.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE user_id = '"+userId+"' AND event_id = '"+eventId+"'", function(err, result){
	connection.query("SELECT v.*,l.location FROM vendor_finalize as vf INNER JOIN vendors as v ON vf.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE event_id = '"+eventId+"'", function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// vendor make finalize
module.exports.makeFinalize = function(vendorId, userId, eventId, callback){
	var now = new Date();
	var date = dateFormat(now, 'yyyy-mm-dd HH:mm:ss');
	var sql = "INSERT INTO vendor_finalize (vendor_id, user_id, event_id, created) VALUES ?";
	var values = [[vendorId,userId,eventId,date]];

	connection.query(sql, [values], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

module.exports.addVendor = function(vendorInfo, vendorCatInfo, callback){
	var sql = "INSERT INTO vendors (vendor_id, vendor_title, vendor_slug, vendor_desc, vendor_location, phone_number,created) VALUES ('"+vendorInfo.vendor_id+"', '"+vendorInfo.vendor_title+"', '"+vendorInfo.vendor_slug+"', '"+vendorInfo.vendor_desc+"', '"+vendorInfo.vendor_location+"', '"+vendorInfo.phone_number+"', '"+vendorInfo.created+"')";

	connection.query(sql, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			for(var i in vendorCatInfo){
				var sql1 = "INSERT INTO vendor_assigned_category (vendor_id, category_id, min_price, max_price, created) VALUES ('"+vendorInfo.vendor_id+"', '"+vendorCatInfo[i].category_id+"', '"+vendorCatInfo[i].min_price+"', '"+vendorCatInfo[i].max_price+"', '"+vendorInfo.created+"')";
				connection.query(sql1);
			}
			callback(null, result);
		}
	});
}

module.exports.updateVendor = function(vendorInfo, vendorCatInfo, callback){
	var sql = "UPDATE vendors SET vendor_desc = '"+vendorInfo.vendor_desc+"', vendor_location = '"+vendorInfo.vendor_location+"' , phone_number = '"+vendorInfo.phone_number+"' WHERE vendor_id = '"+vendorInfo.vendor_id+"'";

	connection.query(sql, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			var del = "DELETE FROM vendor_assigned_category WHERE vendor_id = '"+vendorInfo.vendor_id+"'";
			connection.query(del);
			for(var i in vendorCatInfo){
				var sql1 = "INSERT INTO vendor_assigned_category (vendor_id, category_id, min_price, max_price, created) VALUES ('"+vendorInfo.vendor_id+"', '"+vendorCatInfo[i].category_id+"', '"+vendorCatInfo[i].min_price+"', '"+vendorCatInfo[i].max_price+"', '"+vendorInfo.created+"')";
				connection.query(sql1);
			}
			callback(null, result);
		}
	});
}

// if slug exist
module.exports.ifSlugExist = function(slug, callback){
	var query = "SELECT count(*) as num_rows FROM vendors WHERE vendor_slug LIKE '"+slug+"%'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// create vendor album
module.exports.createAlbum = function(album_name, vendor_id, category_id, callback){
	var now = new Date();
	var date = dateFormat(now, 'yyyy-mm-dd HH:mm:ss');
	var sql = "INSERT INTO vendor_album (album_name, vendor_id, category_id, created) VALUES ?";
	var values = [[album_name,vendor_id,category_id,date]];

	connection.query(sql, [values], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get Vendor Assigned Categories
module.exports.getAssignedCategories = function(vendor_id, callback){
	var query = "SELECT vac.*,vc.category_name FROM vendor_assigned_category as vac LEFT JOIN vendor_category as vc ON vac.category_id = vc.vendor_category_id WHERE vendor_id = '"+vendor_id+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

//get albums
module.exports.getAlbums = function(vendor_id, callback){
	var query = "SELECT a.*, COUNT(vai.id) as count,GROUP_CONCAT(vai.image SEPARATOR ',') as images FROM `vendor_album` as a LEFT JOIN `vendor_album_images` as vai ON a.id = vai.album_id WHERE a.vendor_id = "+vendor_id+" GROUP BY vai.album_id";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

module.exports.uploadImage = function(album_id, image, callback){
	var now = new Date();
	var date = dateFormat(now, 'yyyy-mm-dd HH:mm:ss');
	var sql = "INSERT INTO vendor_album_images (album_id, image, created) VALUES ?";
	var values = [[album_id,image,date]];

	connection.query(sql, [values], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

//get album images
module.exports.getAlbumImages = function(album_id, callback){
	var query = "SELECT album_id,image FROM vendor_album_images WHERE album_id = '"+album_id+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// add vendor promotion
module.exports.addPromotion = function(promotion, callback){
	var now = new Date();
	var date = dateFormat(now, 'yyyy-mm-dd HH:mm:ss');
	var sql = "INSERT INTO vendor_promotions (vendor_id, category_id, discount, description, created) VALUES ?";
	var values = [[promotion.vendor_id,promotion.category_id,promotion.discount,promotion.description,date]];

	connection.query(sql, [values], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

//get vendor promotions
module.exports.getVendorPromotions = function(vendor_id, callback){
	var query = "SELECT p.*,c.category_name FROM vendor_promotions as p LEFT JOIN vendor_category as c ON p.category_id = c.vendor_category_id WHERE p.vendor_id = '"+vendor_id+"' ORDER BY p.created ASC";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

//get popular vendors
module.exports.getPopularVendors = function(callback){
	var query = "SELECT pv.*,v.*,l.location FROM popular_vendors as pv LEFT JOIN vendors as v ON pv.vendor_id = v.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id LIMIT 0,4";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// remove promotion
module.exports.deletePromotion = function(promotionId, callback){
	var query = "DELETE FROM vendor_promotions WHERE id = '"+promotionId+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get vendor category id by category name
module.exports.getCategoryIdByName = function(catName, callback){
	var query = "SELECT vendor_category_id FROM vendor_category WHERE category_name = '"+catName+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get vendor category id by category name
module.exports.getCategoryIdByName = function(catName, callback){
	var query = "SELECT vendor_category_id FROM vendor_category WHERE category_name = '"+catName+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get location id by location name
module.exports.getLocationIdByName = function(city, callback){
	var query = "SELECT id FROM locations WHERE location = '"+city+"'";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get search vendors
module.exports.getSearchVendors = function(catId, locId, callback){
	var query = "SELECT v.*,vac.min_price,vac.max_price,l.location FROM vendors as v LEFT JOIN vendor_assigned_category as vac ON v.vendor_id = vac.vendor_id LEFT JOIN locations as l ON v.vendor_location = l.id WHERE v.vendor_location = '"+locId+"' AND vac.category_id = '"+catId+"' LIMIT 0,10";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get all vendor categories for web
module.exports.getAllVendorCategories = function(callback){
	var query = "SELECT * FROM vendor_category";
	connection.query(query, callback);
}

// get vendor listing count per page
module.exports.getVendorListingCountPerPage = function(callback){
	var query = "SELECT value FROM configuration WHERE name='vendor_listing_per_page'";
	connection.query(query, callback);
}

// update average rating of vendor
module.exports.updateAvgRating = function(vendor_id, callback){
	var query = "SELECT AVG(rating) as rating FROM vendor_reviews WHERE vendor_id = "+vendor_id+"";
	connection.query(query, function(err, rows, fields){
		var query1 = "UPDATE vendors SET rating = "+rows[0].rating+" WHERE vendor_id = "+vendor_id+"";
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

// get category pricing of vendor
module.exports.getCategoryPricing = function(vendor_id, callback){
	var query = "SELECT vac.*, v.category_name FROM vendor_assigned_category as vac LEFT JOIN vendor_category as v ON vac.category_id = v.vendor_category_id WHERE vac.vendor_id = "+vendor_id+"";
	connection.query(query, callback);
}

// get category pricing of vendor
module.exports.getAlbumBannerImage = function(album_id, callback){
	var query = "SELECT image FROM vendor_album_images WHERE album_id = "+album_id+" LIMIT 0,1";
	connection.query(query, callback);
}

// send notification
module.exports.sendNotifications = function(notiData, callback){
	var now = new Date();
	var date = dateFormat(now, 'yyyy-mm-dd HH:mm:ss');
	var sql = "INSERT INTO notifications (receiver_id, event_id, message, notification_for, notification_type, created) VALUES ?";
	var values = [[notiData.receiver_id,notiData.event_id,notiData.message,notiData.notification_for,notiData.notification_type,date]];

	connection.query(sql, [values], function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get unread notifications
module.exports.getUnreadNotifications = function(vendor_id, callback){
	var query = "SELECT count(*) as unread_count FROM notifications WHERE receiver_id = "+vendor_id+" AND read_status = 0";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// get all notifications
module.exports.getNotifications = function(id, callback){
	var query = "SELECT *, (UNIX_TIMESTAMP(created)*1000) as notification_time FROM notifications WHERE receiver_id = "+id+" ORDER BY created ASC";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// change status to read of all notifications by receiver id
module.exports.readAllNotifications = function(id, callback){
	var query = "UPDATE notifications SET read_status = 1 WHERE receiver_id = "+id+"";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// confirm the finalized vendor
module.exports.processOrder = function(order, callback){
	var query = "UPDATE vendor_finalize SET action_performed = "+order.action_performed+" WHERE vendor_id = "+order.vendor_id+" AND event_id = "+order.event_id+"";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// update notification type
module.exports.updateNotificationType = function(noti_id, noti_type, callback){
	var query = "UPDATE notifications SET notification_type = "+noti_type+" WHERE id = "+noti_id+"";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// delete all notifications
module.exports.deleteNotifications = function(callback){
	var query = "DELETE FROM notifications";
	connection.query(query, function(err, result){
		if(err){
			console.log(err);
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

// vendor make favorite
module.exports.makeFavorite = function(vendorId, userId, callback){
	connection.query("INSERT INTO vendor_favorite (vendor_id, user_id, created) VALUES ('"+vendorId+"', '"+userId+"',  NOW())", function(err, result){
			if(err){
				console.log(err);
				callback(err, null);
			}else{
				//console.log(result);
				callback(null, result);
			}
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