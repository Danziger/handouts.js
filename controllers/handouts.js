var express = require('express');
var router = express.Router();
var Bluebird = require('bluebird');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/handouts');

mongoose.mongo.BSONPure = require('bson').BSONPure

var models = require('../models/models')(mongoose);
var Handout = models.Handout;
var Subject = models.Subject;

var gridform = require('gridform');
gridform.db = mongoose.connection.db;
gridform.mongo = mongoose.mongo;


var GFS = gridform.gridfsStream(gridform.db, gridform.mongo);

var lazystream = require('lazystream');
var archiver = require('archiver');


function JSONresponse(res, obj, statusCode) {

	statusCode = (statusCode === parseInt(statusCode, 10) ? statusCode : 200);

	obj.statusCode = statusCode;

	res.json(obj);
};



function JSONerror(res, msg, statusCode) {
	statusCode = (statusCode === parseInt(statusCode, 10) ? statusCode : 400);
	res.json({statusCode, msg});
};






// Autoload for routes that contain :quizId
// DRY (Don't Repeat Yourself)
exports.load = function(req, res, next, handoutID) {

	Handout.findOne({_id: handoutID}).then(function(handout) {
		if(handout) {
			req.handout = handout;
			next();
		}
		else {
			next(new Error("No handout with id = " + handoutID));
		}
	}).catch(function(err){
		next(err);
	});
};










exports.index = function(req, res, next) {

	var now = new Date();
	var promises = [
		Handout.find({df: {$gte: now}}).exec(),	// currentHandouts
		Handout.find({df: {$lt: now}}).exec(),	// closedHandouts
	];

	if(res.locals.authenticated) {
		promises.push(Subject.find({}).exec()); // subjects
		var entryPartial = "./partials/admin/handout.html";
		var previousBlocks = ["./partials/admin/editorTemplates.html", "./partials/admin/createHandout.html"];
	}
	else {
		var entryPartial = "./partials/public/handout.html";
		var previousBlocks = [];
	}

	Bluebird.all(promises).then(function(results){
		res.render('index', {
			now: now,
			currentHandouts: results[0],
			closedHandouts: results[1],
			subjects: results[2],
			entryPartial: entryPartial,
			previousBlocks: previousBlocks
		});
	}).catch(function(err){
		next(err);
	});
};


exports.open = function(req, res, next) {

	var now = new Date();

	Handout.find({df: {$gte: now}}, function(err, docs) {

		if(err) next(err);

		res.render('index', {
			currentHandouts: docs,
			now: now,
			entryPartial: res.locals.authenticated ? "./partials/admin/handout.html" : "./partials/public/handout.html",
			previousBlocks: res.locals.authenticated ? ["./partials/admin/editorTemplates.html"] : []
		});
	});
};



exports.closed = function(req, res, next) {

	var now = new Date();

	Handout.find({df: {$lt: now}}, function(err, docs) {

		if(err) next(err);

		res.render('index', {
			closedHandouts: docs,
			now: now,
			entryPartial: res.locals.authenticated ? "./partials/admin/handout.html" : "./partials/public/handout.html",
			previousBlocks: res.locals.authenticated ? ["./partials/admin/editorTemplates.html", "./partials/admin/editorTemplates.html"] : []
		});
	});
};


exports.new = function(req, res) {
	res.render('index', {
		now: new Date(),
		entryPartial: res.locals.authenticated ? "./partials/admin/handout.html" : "./partials/public/handout.html",
		previousBlocks: res.locals.authenticated ? ["./partials/admin/createHandout.html"] : []
	});
};











exports.handout = function(req, res, next) {

	console.log("Upload handlers...");

	var now = new Date().getTime();

	if(req.handout.df.getTime() < now) {
		return JSONresponse(res, {msg: "Not possible to upload now."});
	}




	var id = req.handout.id;

	if(!isFormData(req)) {
		return JSONerror(res, "Bad Request: Expecting multipart/form-data");
	}
	else if(parseInt(req.headers['content-length']) > 26214912) {
		// 1024 * 1024 * 25 MB + 512 free bytes (headers) 
		return JSONerror(res, "Bad Request: File too big (25 Mb max.)");
	}

	
	console.log('Uploading '+req.headers['content-length']+ ' bytes of data');

	var form = gridform();
	form.encoding = 'utf-8';
	// form.uploadDir = __dirname + "/../temp"; // Not used with GridFS

	var handout = {handout_id: id};

	form.on("field", function(field, value){

		console.log('Field ' + field + ' = ' + value);	

		switch(field) { // Everything else will be ignored
			case "NIU": handout.NIU = value; break;
		}
	});
	
	form.on("file", function(name, file){ // Will not work with overrided onPart
		console.log('File ' + name + ' received.');
	});

	form.on("error", function(err) {
		that.error(req, res, 500, "500 Internal Server Error: Ops, something broke...");
	});
	
	form.on("end", function(){
		res.setHeader("Content-Type", "text/plain");
		res.end("1000");
	});

	form.on('fileBegin', function (name, file) {

		// TO-DO: Validate all form fields here and return a JSON response

		console.log("File " + name +  " begin:");
		console.log(file);
		console.log(handout);
		file.metadata = handout;

		if(file.name.length === 0) {
			req.pause();
   			//res.status(400).end("No file found.");
   			return JSONerror(res, "Bad Request: No file found.");
		}
		else if(file.type !== "application/zip") {
			req.pause();
   			//res.status(400).end("Invalid file format. ZIP expected.");
   			return JSONerror(res, "Invalid file format. ZIP expected.");
		}
	});


	form.parse(req, function(err, fields, files) {
		/*
	    // use files and fields as you do today
	    var file = files.upload;

	    file.name // the uploaded file name
	    file.type // file type per [mime](https://github.com/bentomas/node-mime)
	    file.size // uploaded file size (file length in GridFS) named "size" for compatibility
	    file.path // same as file.name. included for compatibility
	    file.lastModified // included for compatibility

	    // files contain additional gridfs info
	    file.root // the root of the files collection used in MongoDB ('fs' here means the full collection in mongo is named 'fs.files')
	    file.id   // the ObjectId for this file

	    */

	    console.log(fields);
	    console.log(files);
		
	});

	//res.end("1");

};





exports.download = function(req, res, next) {


	console.log("DOWN!!");


	var id = req.params.id;
	//var _id = req.url.split("/")[2]; // TO-DO: Check if valid!


	// TO-DO: Remove duplicates!
	/*
	db.fs.files.aggregate([{$match: {"metadata.handout_id": _id}}, {$sort: {uploadDate:-1}}, {$group: {_id: "$filename", date: {"$first": "$uploadDate"}, "contentType": {"$first": "$contentType"}}}])
	
	GFS.files.aggregate([
		{$match: {"metadata.handout_id": _id}},
		{$sort: {uploadDate:-1}},
		{$group: {
			id: "$_id",
			_id: "$filename",
			date: {"$first": "$uploadDate"},
			"contentType": {"$first": "$contentType"}
		}}
		
	]).toArray(function (err, files) {
	*/

	GFS.files.find({"metadata.handout_id": id}).toArray(function (err, files) {

		// TO-DO: if (err) ...

		if(files.length > 0) {

			// TO-DO: Configurable file name!
			res.writeHead(200, {'Content-Type': 'application/zip', 'Content-Disposition' : 'attachment; filename=handout-'+id+'.zip' });
			
			var streams = files.map(function(f) {
			
				console.log(f);
			
				var s = { 
					name : f.filename, // or whatever it actually is (from database)
					stream : new lazystream.Readable(function (options) {

						 console.log('Reading file ' + f.filename + '.');
						 return GFS.createReadStream({ _id: f._id });
					})
				};

				return s;
			});

			sendFilesInAZip(streams, res);
		}
		else {
			res.redirect("/");
		}


	});
};




exports.create = function(req, res) {


	console.log("CREATE");
	res.end("CREATE");

};


exports.delete = function(req, res) {

	console.log("DELETE");
	res.end("DELETE");

};



exports.update = function(req, res) {

	console.log("UPDATE");
	res.end("UPDATE");

};


exports.get = function(req, res) {

	console.log("GET");
	res.end("GET");

};


function isFormData(req){
	var type = req.headers["content-type"] || "";
	return 0 == type.indexOf("multipart/form-data");
};







function sendFilesInAZip(streams, response) {
	// Create new zip file
	var zip = archiver('zip');

	// Set up some callbacks
	zip.on('error', function(err) { throw err; });

	zip.on('finish', function() {
		console.log('Zip file has been sent, with a total of ' + zip.pointer() + ' bytes.');
		response.end();
	});

	zip.pipe(response);

	console.log('Setting up zip file contents.');

	streams.forEach(function(s) {
		zip.append(s.stream, { name: s.name });
	});

	zip.finalize();

	console.log('Zip creation has been started.');
};



