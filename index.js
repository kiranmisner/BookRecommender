// NEW TEST SERVER ARYAN IS MAKING

const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

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

app.post('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log(req.body)
  res.write('true');
  res.end()
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
