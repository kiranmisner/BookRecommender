var http = require("http");
var MongoClient = require("mongodb").MongoClient;
var url =require('url');
var port = 8080;

var uri = "mongodb+srv://brogrammer:brogrammer@comp20final-bwg6b.mongodb.net/test?retryWrites=true&w=majority"

http.createServer(function(req,res){
  /* Google Chrome will often send favicon.ico requests when server
   * gets a request. This if statement will not take the favicon
   * request as a query. 
   */
  if (req.url === '/favicon.ico') {
      res.writeHead(200, {'Content-Type': 'image/x-icon'} );
      r.end();
      console.log('favicon requested');
      return;
  }

  res.writeHead(200,{'Content-Type':'text/html'});

  /*  Take in the query object and the qury itself */
  var qobj = url.parse(req.url,true);
  var u_username = qobj.query.username;
  var u_password = qobj.query.password;

  /* Connect to Mongodb and go into correct database/collection */
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
     if (err) {
        console.log(err);
      } 
     var dbo = db.db("BookRecommender");
     /* Use find one to either find a Company name or a Ticker because the query could 
      * potentially be either!
      */
     dbo.collection("Users").findOne({ $and: [{username: u_username}, {password: u_password}]} , (err, result) => {
     /* If result is null (not in database) tell the user that and return */
     if (result == null) {
        console.log("not found");
        res.write("You currently do not have an account. Sign up here!");
        return;
     }
     /* Otherwise, set the company name to the result and display it to the user */
     res.write("Welcome back " + u_username + "!");
     /* Close the database */
     db.close();
    });

   });
  }).listen(8080);


