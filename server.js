const express = require('express')
const path = require('path')
var mongoose = require('mongoose')

const port = process.env.PORT || 3000

const app = express()
var mongoDB = 'mongodb://mutasem:mutasem@ds111410.mlab.com:11410/testdb0'

app.use(express.static(path.join(__dirname, 'public')))
app.get('/new/:website', (req, res) => {
  const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  // console.log(req.params.website)
  let website = req.params.website
  let isValid = Boolean(pattern.test(website))
  
  if (isValid) {
    mongoose.connect(mongoDB, (err, db) => {
      if (err) { return err }
      db.collection('websites').find({'old': website}).forEach((item) => {
        console.log(item)
        // res.send(JSON.stringify({
        //   'short': item.new
        // }))
      })

      // db.close()
    })
  } else {
    res.send(JSON.stringify({
      'error': 'This url is invalid'
    }))
  }
})

// app.get('/new/:website', (req, res) => {
//     
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

app.listen(port, console.log(`Listening on port ${port}`))
