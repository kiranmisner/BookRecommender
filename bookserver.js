var http = require("http");
var MongoClient = require("mongodb").MongoClient;
var url =require('url');
var port = 8080;

var uri = "mongodb+srv://brogrammer:brogrammer@comp20final-bwg6b.mongodb.net/test?retryWrites=true&w=majority"

/* NOTE TO OTHER PEOPLE: THE WAY WE ARE CURRENTLY PARSING BY WHERE THE REQUEST IS COMING FROM IS A 
 * HIDDEN FORM VALUE CALLED SITE. PLEASE MAKE SURE TO SEND THIS VALUE ALONG WITH YOUR FORM DATA.
 */

http.createServer(function(req,res){
  var qobj = url.parse(req.url,true);
  var site = qobj.query.site;
  res.writeHead(200,{'Content-Type':'text/html'});
	if (req.url === '/favicon.ico') {
      res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    	r.end();
    	console.log('favicon requested');
    	return; 
  } else if (site == "signup") { /* request here is coming from the signup page */
      // Take in the query object and the query itself ;
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
  } else if (site = "signin") { /* request here is coming from the signin page */
      console.log("signin");
      var u_username = qobj.query.username;
      var u_password = qobj.query.password;

      /* Connect to Mongodb and go into correct database/collection */
      MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
          if (err) {
            console.log(err);
        } 
        var dbo = db.db("BookRecommender");
        console.log("after books");
        dbo.collection("Users").findOne({ $and: [{username: u_username}, {password: u_password}]} , (err, result) => {
        /* If result is null (not in database) user doesn't have an account */
          if (result == null) {
            console.log("not found");
            res.write("You currently do not have an account. Sign up here!");
              return;
          }
          console.log("Result: " + result);
          /* Otherwise, welcome the user back to our site */
          res.write("Welcome back " + u_username + "!");
          /* Close the database */
          db.close();
        });
      });
  } else {
    console.log("Didn't know what to do with request");
    return;
  }
}).listen(port);
