const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());
app.use('/pics', express.static(__dirname +'/pics'))

const PORT = process.env.PORT || 3000;

// Connection URL
const url = 'mongodb+srv://brogrammer:brogrammer@comp20final-bwg6b.mongodb.net/test?retryWrites=true&w=majority';
 
// Database Name
const dbName = 'BookRecommender';

const findBooks = function(db, callback, name) {
    // Get the documents collection
    const collection = db.collection('Users');
    // Find some documents
    collection.find({username: name}).toArray(function(err, docs) {
      if (err) {console.log(err); return;}
      callback(docs[0].bookshelf)
    });
  }

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/htmlfiles/index.html'));
})

app.get('/sign_up', (req, res) => {
    res.sendFile(path.join(__dirname, '/htmlfiles/signup.html'));
})

app.post('/sign_up', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('true');
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true},function(err, client) {
          if (err) {
            console.log(err);
            return;
          } 
          console.log("Connected successfully to server");
          var db = client.db("BookRecommender");
          var collection = db.collection("Users");
          var JSONobj = { username: req.body.u, password: req.body.p};
          collection.insertOne(JSONobj, function(err, res) {
            if (err) {
              console.log(err);
              return;
            } 
          }); 
      });
    console.log("new sign up entered!");
})

app.get('/my_bookshelf', (req, res) => {
    res.sendFile(path.join(__dirname, '/htmlfiles/bookshelf.html'));
})

app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.send("done")
})

app.post('/login', (req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log(req.body);
  MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, client) {
        if (err) {console.log(err); return;}
        
        console.log("Connected successfully to server");
        var dbo = client.db("BookRecommender");
        dbo.collection("Users").findOne({ $and: [{username: req.body.u}, {password: req.body.p}]} , (err, result) => {
            console.log("searching...");
            /* If result is null (not in database) tell the user that and return */
            if (result == null) {
                console.log("not found");
                res.write('false');
                res.end();
                return;
            } else {
              console.log("found");
              res.cookie("username", req.body.u);
              res.write('true');
              res.end();
              return;
            }
        });
    });
    
})

app.post('/addto', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log(req.body);
  MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
  }, function(err, client) {
    if (err) {console.log(err); return;}
    console.log("Connected successfully to server");
    var dbo = client.db("BookRecommender");
    dbo.collection("Users").updateOne({username: req.body.uname} , {$addToSet: {bookshelf: req.body.link}},(err, result) => {
       console.log("searching...");
       if (err) {
        res.write("false");
        console.log(err); 
        res.end()
        return;
       }
       console.log("Added");
       res.write("true");
       res.end()
    });
  });
})

app.post('/get_bookshelf', (req, res) => {
    console.log(req.body);
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, client) {
        if (err) {console.log(err); return;}
        console.log("Connected successfully to server");
        
        const db = client.db(dbName);
        findBooks(db, function(docs) {
            res.send(docs)
            client.close()
        }, req.body.u);
    })
  })

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
