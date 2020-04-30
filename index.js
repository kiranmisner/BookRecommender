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

const PORT = process.env.PORT || 3000;

// Connection URL
const url = 'mongodb+srv://brogrammer:brogrammer@comp20final-bwg6b.mongodb.net/test?retryWrites=true&w=majority';
 
// Database Name
const dbName = 'BookRecommender';

const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('Users');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      if (err) {console.log(err); return;}
      console.log("Found the following records");
      console.log(docs)
      callback(docs);
    });
  }

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/htmlfiles/index.html'));
})

app.get('/sign_up', (req, res) => {
    res.sendFile(path.join(__dirname, '/htmlfiles/signup.html'));
})

app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.send("done")
})

app.get('/mongo', (req, res) => {
     MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, client) {
        if (err) {console.log(err); return;}
        console.log("Connected successfully to server");
        
        const db = client.db(dbName);
        findDocuments(db, function(docs) {
            res.send(docs)
            client.close()
        });
})
});

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
        return;
       }
       console.log("Added");
       res.write("true");
    });
  });
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
