var http = require("http");
var MongoClient = require("mongodb").MongoClient;
var url =require('url');
var port = 8080;

var uri = "mongodb+srv://brogrammer:brogrammer@comp20final-bwg6b.mongodb.net/test?retryWrites=true&w=majority"

http.createServer(function(req,res){
   // Google Chrome will often send favicon.ico requests when server
   // gets a request. This if statement will not take the favicon
   // request as a query. 
	if (req.url === '/favicon.ico') {
    	res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    	r.end();
    	console.log('favicon requested');
    	return;
    }
    res.writeHead(200,{'Content-Type':'text/html'});

 	// Take in the query object and the query itself 
	var qobj = url.parse(req.url,true);
	var username = qobj.query.username;
	var password = qobj.query.password;
	var JSONobj = { username: username, password: password};
	res.write("Hi there " + username + "! Your account has been added!");
	MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
 	    if (err) {
        console.log(err);
        return;
      } 
      var db = db.db("BookRecommender");
      var collection = db.collection("Users");
      collection.insertOne(JSONobj, function(err, res) {
        if (err) throw err;
        console.log("new document inserted");
      }); 
    });
}).listen(port);
