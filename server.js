const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();

const mongo = require('mongodb').MongoClient;
// const url = 'mongodb://https://url-shortener-service-ffc.herokuapp.com/heroku_prtr1p3x';


var dbUrl = 'mongodb://amk:W4UY|c-_hyJc7nJ@ds013222.mlab.com:13222/shorten_url';
// const DB = {
//     server: "ds155288",
//     port: 55288 || 27017,
//     dbname: "heroku_prtr1p3x"
// };

// DB.conn = mongo(DB.server, DB.port, DB.dbname);

// console.log(DB.conn);
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    mongo.connect(dbUrl, (err, db) => {
        console.log('db: ', db);

        var urlList = db.collection('urlList');
        // db.getCollection('urlList').find({});
        db.getCollectionNames();
    });
});


// app.get('/new/:website', (req, res) => {
//     const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
//     let userInput = req.params.website;
    
//     let isValid = Boolean(pattern.test(userInput));
//     console.log(isValid);
//     if (isValid) {
//         mongo.connect(url, (err, db) => {
//             if (err) throw err;
//             const docs = db.db('heroku_prtr1p3x').collection('urls');
//             console.log('docs: ', docs);
//             // docs.getAll().then(data => {
//             //     console.log('New age: 40');
//             // }).catch(console.log());
        
//             db.close();
//         });

//     } else {
//         res.send(JSON.stringify({
//             "error": "This url is not on the database."
//         }));
//     }
// });

app.listen(port, console.log(`Listening on port ${port}`));
